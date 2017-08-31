import PropTypes from 'prop-types'
import React, { Component } from 'react'
import trimCanvas from 'trim-canvas'

import Bezier from './bezier.js'
import Point from './point.js'

export default class SignatureCanvas extends Component {
  static propTypes = {
    velocityFilterWeight: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    penColor: PropTypes.string,
    onEnd: PropTypes.func,
    onBegin: PropTypes.func,
    canvasProps: PropTypes.object,
    clearOnResize: PropTypes.bool
  }

  static defaultProps = {
    velocityFilterWeight: 0.7,
    minWidth: 0.5,
    maxWidth: 2.5,
    dotSize: (minWidth, maxWidth) => {
      return ((minWidth || 0.5) + (maxWidth || 2.5)) / 2
    },
    penColor: 'black',
    onEnd: () => {},
    onBegin: () => {},
    backgroundColor: 'rgba(0,0,0,0)',
    clearOnResize: true
  }

  componentDidMount () {
    this._ctx = this._canvas.getContext("2d");

    this._handleMouseEvents();
    this._handleTouchEvents();
    this._resizeCanvas();
    this.clear()
  }

  componentWillUnmount() {
    this.off();
  }

  clear = () => {
    let ctx = this._ctx
    let canvas = this._canvas

    ctx.fillStyle = this.props.backgroundColor
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this._reset()
  }

  fromDataURL = (dataURL) => {
    let image = new Image()
    let ratio = window.devicePixelRatio || 1
    let width = this._canvas.width / ratio
    let height = this._canvas.height / ratio

    this._reset()
    image.onload = () => this._ctx.drawImage(image, 0, 0, width, height)
    image.src = dataURL
    this._isEmpty = false
  }

  // return the canvas ref for operations like toDataURL
  getCanvas = () => {
    return this._canvas
  }

  // return a trimmed copy of the canvas
  getTrimmedCanvas = () => {
    // copy the canvas
    let copy = document.createElement('canvas')
    copy.width = this._canvas.width
    copy.height = this._canvas.height
    copy.getContext('2d').drawImage(this._canvas, 0, 0)
    // then trim it
    return trimCanvas(copy)
  }

  isEmpty = () => this._isEmpty

  _checkClearOnResize = () => {
    if (!this.props.clearOnResize) {
      return
    }
    this._resizeCanvas()
  }

  _resizeCanvas = () => {
    let canvasProps = this.props.canvasProps || {}
    let {width, height} = canvasProps

    let ctx = this._ctx
    let canvas = this._canvas
    /* When zoomed out to less than 100%, for some very strange reason,
      some browsers report devicePixelRatio as less than 1
      and only part of the canvas is cleared then. */
    let ratio =  Math.max(window.devicePixelRatio || 1, 1)

    // only change width/height if none has been passed in as a prop
    if (!width) {
      canvas.width = canvas.offsetWidth * ratio
    }
    if (!height) {
      canvas.height = canvas.offsetHeight * ratio
    }
    if(!width || !height) {
      ctx.scale(ratio, ratio)
    }
  }

  _reset = () => {
    this.points = [];
    this._lastVelocity = 0;
    this._lastWidth = (this.props.minWidth + this.props.maxWidth) / 2
    this._isEmpty = true;
    this._ctx.fillStyle = this.props.penColor
  }

  _handleMouseEvents = () => {
    this._mouseButtonDown = false;

    this._canvas.addEventListener('mousedown', this._handleMouseDown)
    this._canvas.addEventListener('mousemove', this._handleMouseMove)
    document.addEventListener('mouseup', this._handleMouseUp)

    window.addEventListener('resize', this._checkClearOnResize)
  }

  _handleTouchEvents = () => {
    // Pass touch events to canvas element on mobile IE.
    this._canvas.style.msTouchAction = 'none';

    this._canvas.addEventListener('touchstart', this._handleTouchStart)
    this._canvas.addEventListener('touchmove', this._handleTouchMove)
    document.addEventListener('touchend', this._handleTouchEnd)
  }

  off = () => {
    this._canvas.removeEventListener('mousedown', this._handleMouseDown)
    this._canvas.removeEventListener('mousemove', this._handleMouseMove)
    document.removeEventListener('mouseup', this._handleMouseUp)

    this._canvas.removeEventListener("touchstart", this._handleTouchStart)
    this._canvas.removeEventListener("touchmove", this._handleTouchMove)
    document.removeEventListener("touchend", this._handleTouchEnd)

    window.removeEventListener('resize', this._checkClearOnResize)
  }

  _handleMouseDown = (ev) => {
    if (ev.which === 1) {
      this._mouseButtonDown = true
      this._strokeBegin(ev)
    }
  }

  _handleMouseMove = (ev) => {
    if (this._mouseButtonDown) {
      this._strokeUpdate(ev)
    }
  }

  _handleMouseUp = (ev) => {
    if (ev.which === 1 && this._mouseButtonDown) {
      this._mouseButtonDown = false
      this._strokeEnd(ev)
    }
  }

  _handleTouchStart = (ev) => {
    let touch = ev.changedTouches[0]
    this._strokeBegin(touch)
  }

  _handleTouchMove = (ev) => {
    // prevent scrolling
    ev.preventDefault()

    let touch = ev.changedTouches[0]
    this._strokeUpdate(touch)
  }

  _handleTouchEnd = (ev) => {
    let wasCanvasTouched = ev.target === this._canvas
    if (wasCanvasTouched) {
      this._strokeEnd(ev)
    }
  }

  _strokeUpdate = (ev) => {
    let point = this._createPoint(ev)
    this._addPoint(point)
  }

  _strokeBegin = (ev) => {
    this._reset()
    this._strokeUpdate(ev)
    this.props.onBegin(ev)
  }

  _strokeDraw = (point) => {
    let ctx = this._ctx
    let dotSize = typeof(this.props.dotSize) === 'function'
      ? this.props.dotSize(
        this.props.minWidth,
        this.props.maxWidth
      )
      : this.props.dotSize

    ctx.beginPath();
    this._drawPoint(point.x, point.y, dotSize);
    ctx.closePath();
    ctx.fill();
  }

  _strokeEnd = (ev) => {
    var canDrawCurve = this.points.length > 2,
        point = this.points[0];

    if (!canDrawCurve && point) {
      this._strokeDraw(point);
    }

    this.props.onEnd(ev)
  }

  _createPoint = (ev) => {
    let rect = this._canvas.getBoundingClientRect()
    return new Point(ev.clientX - rect.left, ev.clientY - rect.top)
  }

  _addPoint = (point) => {
    var points = this.points,
        c2, c3,
        curve, tmp;

    points.push(point);

    if (points.length > 2) {
      // To reduce the initial lag make it work with 3 points
      // by copying the first point to the beginning.
      if (points.length === 3) points.unshift(points[0]);

      tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
      c2 = tmp.c2;
      tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
      c3 = tmp.c1;
      curve = new Bezier(points[1], c2, c3, points[2]);
      this._addCurve(curve);

      // Remove the first element from the list,
      // so that we always have no more than 4 points in points array.
      points.shift();
    }
  }

  _calculateCurveControlPoints(s1, s2, s3) {
    var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
        dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,

        m1 = {x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0},
        m2 = {x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0},

        l1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        l2 = Math.sqrt(dx2*dx2 + dy2*dy2),

        dxm = (m1.x - m2.x),
        dym = (m1.y - m2.y),

        k = l2 / (l1 + l2),
        cm = {x: m2.x + dxm*k, y: m2.y + dym*k},

        tx = s2.x - cm.x,
        ty = s2.y - cm.y;

    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m2.x + tx, m2.y + ty)
    };
  };

  _addCurve = (curve) => {
    var startPoint = curve.startPoint,
        endPoint = curve.endPoint,
        velocity, newWidth;

    velocity = endPoint.velocityFrom(startPoint);
    velocity = this.props.velocityFilterWeight * velocity
      + (1 - this.props.velocityFilterWeight) * this._lastVelocity;

    newWidth = this._strokeWidth(velocity);
    this._drawCurve(curve, this._lastWidth, newWidth);

    this._lastVelocity = velocity;
    this._lastWidth = newWidth;
  }

  _drawPoint = (x, y, size) => {
    var ctx = this._ctx;

    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    this._isEmpty = false;
  }

  _drawCurve = (curve, startWidth, endWidth) => {
    var ctx = this._ctx,
        widthDelta = endWidth - startWidth,
        drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;

    drawSteps = Math.floor(curve.length());
    ctx.beginPath();
    for (i = 0; i < drawSteps; i++) {
        // Calculate the Bezier (x, y) coordinate for this step.
        t = i / drawSteps;
        tt = t * t;
        ttt = tt * t;
        u = 1 - t;
        uu = u * u;
        uuu = uu * u;

        x = uuu * curve.startPoint.x;
        x += 3 * uu * t * curve.control1.x;
        x += 3 * u * tt * curve.control2.x;
        x += ttt * curve.endPoint.x;

        y = uuu * curve.startPoint.y;
        y += 3 * uu * t * curve.control1.y;
        y += 3 * u * tt * curve.control2.y;
        y += ttt * curve.endPoint.y;

        width = startWidth + ttt * widthDelta;
        this._drawPoint(x, y, width);
    }
    ctx.closePath();
    ctx.fill();
  }

  _strokeWidth = (velocity) => {
    return Math.max(this.props.maxWidth / (velocity + 1), this.props.minWidth)
  }

  render () {
    let {canvasProps} = this.props
    return <canvas ref={(ref) => { this._canvas = ref }} {...canvasProps} />
  }
}
