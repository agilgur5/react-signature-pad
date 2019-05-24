# React Signature Canvas

[![package-json](https://img.shields.io/github/package-json/v/agilgur5/react-signature-canvas.svg)](https://npmjs.org/package/react-signature-canvas)
[![releases](https://img.shields.io/github/release/agilgur5/react-signature-canvas.svg)](https://github.com/agilgur5/react-signature-canvas/releases)
[![commits](https://img.shields.io/github/commits-since/agilgur5/react-signature-canvas/latest.svg)](https://github.com/agilgur5/react-signature-canvas/commits/master)

[![dt](https://img.shields.io/npm/dt/react-signature-canvas.svg)](https://npmjs.org/package/react-signature-canvas)
[![dy](https://img.shields.io/npm/dy/react-signature-canvas.svg)](https://npmjs.org/package/react-signature-canvas)
[![dm](https://img.shields.io/npm/dm/react-signature-canvas.svg)](https://npmjs.org/package/react-signature-canvas)
[![dw](https://img.shields.io/npm/dw/react-signature-canvas.svg)](https://npmjs.org/package/react-signature-canvas)

[![NPM](https://nodei.co/npm/react-signature-canvas.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/react-signature-canvas)

A React wrapper component around [signature_pad](https://github.com/szimek/signature_pad).

Originally, this was just an _unopinionated_ fork of [react-signature-pad](https://github.com/blackjk3/react-signature-pad) that did not impose any styling or wrap any other unwanted elements around your canvas -- it's just a wrapper around a single canvas element!
Hence the naming difference.
Nowadays, this repo / library has significantly evolved, introducing new features, fixing various bugs, and now wrapping the upstream `signature_pad` to have its updates and bugfixes baked in.

This fork also allows you to directly pass [props](#props) to the underlying canvas element, has new, documented [API methods](#api) you can use, and has new, documented [props](#props) you can pass to it.

## Installation

`npm i -S react-signature-canvas`

## Usage

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import SignatureCanvas from 'react-signature-canvas'

ReactDOM.render(
  <SignatureCanvas penColor='green'
    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} />,
  document.getElementById('react-container')
)
```

### Props

The props of SignatureCanvas mainly control the properties of the pen stroke used in drawing.
All props are **optional**.

- `velocityFilterWeight` : `number`, default: `0.7`
- `minWidth` : `number`, default: `0.5`
- `maxWidth` : `number`, default: `2.5`
- `minDistance`: `number`, default: `5`
- `dotSize` : `number` or `function`,
  default: `() => (this.minWidth + this.maxWidth) / 2`
- `penColor` : `string`, default: `'black'`
- `throttle`: `number`, default: `16`

There are also two callbacks that will be called when a stroke ends and one begins, respectively.

- `onEnd` : `function`
- `onBegin` : `function`

Additional props are used to control the canvas element.

- `canvasProps`: `object`
  - directly passed to the underlying `<canvas />` element
- `backgroundColor` : `string`, default: `'rgba(0,0,0,0)'`
  - used in the [API's](#api) `clear` convenience method (which itself is called internally during resizes)
- `clearOnResize`: `bool`, default: `true`
  - whether or not the canvas should be cleared when the window resizes

Of these props, all, except for `canvasProps` and `clearOnResize`, are passed through to `signature_pad` as its [options](https://github.com/szimek/signature_pad#options).
`signature_pad`'s internal state is automatically kept in sync with prop updates for you (via a `componentDidUpdate` hook).

### API

All API methods require a ref to the SignatureCanvas in order to use and are instance methods of the ref.

```javascript
<SignatureCanvas ref={(ref) => { this.sigCanvas = ref }} />
```

- `isEmpty()` : `boolean`, self-explanatory
- `clear()` : `void`, clears the canvas using the `backgroundColor` prop
- `fromDataURL(base64String, options)` : `void`, writes a base64 image to canvas
- `toDataURL(mimetype, encoderOptions)`: `base64string`, returns the signature image as a data URL
- `fromData(pointGroupArray)`: `void`, draws signature image from an array of point groups
- `toData()`: `pointGroupArray`, returns signature image as an array of point groups
- `off()`: `void`, unbinds all event handlers
- `on()`: `void`, rebinds all event handlers
- `getCanvas()`: `canvas`, returns the underlying canvas ref.
  Allows you to modify the canvas however you want or call methods such as `toDataURL()`
- `getTrimmedCanvas()`: `canvas`, creates a copy of the canvas and returns a [trimmed version](https://github.com/agilgur5/trim-canvas) of it, with all whitespace removed.
- `getSignaturePad()`: `SignaturePad`, returns the underlying SignaturePad reference.

The API methods are _mostly_ just wrappers around [`signature_pad`'s API](https://github.com/szimek/signature_pad#api).
`on()` and `off()` will, in addition, bind/unbind the window resize event handler.
`getCanvas()`, `getTrimmedCanvas()`, and `getSignaturePad()` are new.

## Example

```bash
npm start
```

Navigate to [http://localhost:8080/](http://localhost:8080/) in your browser and you should be able to see the signature canvas in action.

The source code for this example is found in the [`example/`](example/) directory.
