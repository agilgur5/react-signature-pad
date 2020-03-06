import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SignaturePad from 'signature_pad'
import trimCanvas from 'trim-canvas'

export interface ReactSignatureCanvasProps extends SignaturePad.SignaturePadOptions {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  clearOnResize: boolean
}

export default class ReactSignatureCanvas extends Component<ReactSignatureCanvasProps> {
  static propTypes = {
    // signature_pad's props
    velocityFilterWeight: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minDistance: PropTypes.number,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    penColor: PropTypes.string,
    throttle: PropTypes.number,
    onEnd: PropTypes.func,
    onBegin: PropTypes.func,
    // props specific to the React wrapper
    canvasProps: PropTypes.object,
    clearOnResize: PropTypes.bool
  }

  static defaultProps: Pick<ReactSignatureCanvasProps, 'clearOnResize'> = {
    clearOnResize: true
  }

  static refNullError = new Error('react-signature-canvas is currently ' +
    'mounting or unmounting: React refs are null during this phase.')

  // shortcut reference (https://stackoverflow.com/a/29244254/3431180)
  private readonly staticThis = this.constructor as typeof ReactSignatureCanvas

  _sigPad: SignaturePad | null = null
  _canvas: HTMLCanvasElement | null = null

  private readonly setRef = (ref: HTMLCanvasElement | null): void => {
    this._canvas = ref
    // if component is unmounted, set internal references to null
    if (this._canvas === null) {
      this._sigPad = null
    }
  }

  _excludeOurProps = (): SignaturePad.SignaturePadOptions => {
    const { canvasProps, clearOnResize, ...sigPadProps } = this.props
    return sigPadProps
  }

  componentDidMount: Component['componentDidMount'] = () => {
    const canvas = this.getCanvas()
    this._sigPad = new SignaturePad(canvas, this._excludeOurProps())
    this._resizeCanvas()
    this.on()
  }

  componentWillUnmount: Component['componentWillUnmount'] = () => {
    this.off()
  }

  // propagate prop updates to SignaturePad
  componentDidUpdate: Component['componentDidUpdate'] = () => {
    Object.assign(this._sigPad, this._excludeOurProps())
  }

  // return the canvas ref for operations like toDataURL
  getCanvas = (): HTMLCanvasElement => {
    if (this._canvas === null) {
      throw this.staticThis.refNullError
    }
    return this._canvas
  }

  // return a trimmed copy of the canvas
  getTrimmedCanvas = (): HTMLCanvasElement => {
    // copy the canvas
    const canvas = this.getCanvas()
    const copy = document.createElement('canvas')
    copy.width = canvas.width
    copy.height = canvas.height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    copy.getContext('2d')!.drawImage(canvas, 0, 0)
    // then trim it
    return trimCanvas(copy)
  }

  // return the internal SignaturePad reference
  getSignaturePad = (): SignaturePad => {
    if (this._sigPad === null) {
      throw this.staticThis.refNullError
    }
    return this._sigPad
  }

  _checkClearOnResize = (): void => {
    if (!this.props.clearOnResize) {
      return
    }
    this._resizeCanvas()
  }

  _resizeCanvas = (): void => {
    const canvasProps = this.props.canvasProps ?? {}
    const { width, height } = canvasProps
    // don't resize if the canvas has fixed width and height
    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
      return
    }

    const canvas = this.getCanvas()
    /* When zoomed out to less than 100%, for some very strange reason,
      some browsers report devicePixelRatio as less than 1
      and only part of the canvas is cleared then. */
    const ratio = Math.max(window.devicePixelRatio ?? 1, 1)

    if (typeof width === 'undefined') {
      canvas.width = canvas.offsetWidth * ratio
    }
    if (typeof height === 'undefined') {
      canvas.height = canvas.offsetHeight * ratio
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    canvas.getContext('2d')!.scale(ratio, ratio)
    this.clear()
  }

  render: Component['render'] = () => {
    const { canvasProps } = this.props
    return <canvas ref={this.setRef} {...canvasProps} />
  }

  // all wrapper functions below render
  //
  on: SignaturePad['on'] = () => {
    window.addEventListener('resize', this._checkClearOnResize)
    return this.getSignaturePad().on()
  }

  off: SignaturePad['off'] = () => {
    window.removeEventListener('resize', this._checkClearOnResize)
    return this.getSignaturePad().off()
  }

  clear: SignaturePad['clear'] = () => {
    return this.getSignaturePad().clear()
  }

  isEmpty: SignaturePad['isEmpty'] = () => {
    return this.getSignaturePad().isEmpty()
  }

  fromDataURL: SignaturePad['fromDataURL'] = (dataURL, options) => {
    return this.getSignaturePad().fromDataURL(dataURL, options)
  }

  toDataURL: SignaturePad['toDataURL'] = (type, encoderOptions) => {
    return this.getSignaturePad().toDataURL(type, encoderOptions)
  }

  fromData: SignaturePad['fromData'] = (pointGroups) => {
    return this.getSignaturePad().fromData(pointGroups)
  }

  toData: SignaturePad['toData'] = () => {
    return this.getSignaturePad().toData()
  }
}
