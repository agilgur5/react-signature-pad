// polyfill window.resizeTo in jsdom environment
// https://spectrum.chat/testing-library/help-react/how-to-set-window-innerwidth-to-test-mobile~70aa9572-b7cc-4397-92f5-a09d75ed24b8?m=MTU1OTU5MTI2MTI0MQ==
window.resizeTo = function resizeTo (width, height) {
  Object.assign(window, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height
  }).dispatchEvent(new window.Event('resize'))
}
