// signature_pad options
const sigPadOptions = {
  velocityFilterWeight: 0.8,
  minWidth: 0.6,
  maxWidth: 2.6,
  minDistance: 4,
  dotSize: 2,
  penColor: 'green',
  throttle: 17,
  onEnd: () => { return 'onEnd' },
  onBegin: () => { return 'onBegin' }
}
// props specific to React wrapper
const rSCProps = {
  canvasProps: { width: 500, height: 500 },
  clearOnResize: false
}
// should all be different from the defaults
const props = { ...sigPadOptions, ...rSCProps }
export const propsF = { sigPadOptions, all: props }

const dotData = [
  [{ x: 466.59375, y: 189, time: 1564339579755, color: 'black' }]
]
const canvasProps = { width: 1011, height: 326 }
const trimmedSize = { width: 4, height: 4 }
export const dotF = { data: dotData, canvasProps, trimmedSize }
