import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import SignaturePad from '../src/index.js'

import styles from './styles.cssm'

class ClearOnResizeExamplePage extends Component {
  state = {trimmedDataURL: null}
  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }
  trim = () => {
    this.setState({trimmedDataURL: this.sigPad.getTrimmedCanvas()
      .toDataURL('image/png')})
  }
  render () {
    let {trimmedDataURL} = this.state
    return <div className={styles.container}>
      <div className={styles.sigContainer}>
        <SignaturePad canvasProps={{className: styles.sigPad}}
          ref={(ref) => { this.sigPad = ref }} />
      </div>
      <div>
        <button className={styles.buttons} onClick={this.clear}>
          Clear
        </button>
        <button className={styles.buttons} onClick={this.trim}>
          Trim
        </button>
      </div>
      {trimmedDataURL
        ? <img className={styles.sigImage}
          src={trimmedDataURL} />
        : null}
    </div>
  }
}

class NonClearOnResizePage extends Component {
  state = {trimmedDataURL: null}
  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }
  trim = () => {
    this.setState({trimmedDataURL: this.sigPad.getTrimmedCanvas()
      .toDataURL('image/png')})
  }
  render () {
    let {trimmedDataURL} = this.state
    return <div className={styles.container}>
      <p>
        By setting <code>clearOnResize</code> to <code>false</code>,
        this canvas will not be cleared when the browser resizes,
        so it is the responsability of the user or the app to clear
        the canvas if the signature is not visible anymore.
        The dimensions of this canvas are set to "very big"
        (1000x1000, check the styles file) and the container
        of the canvas is responsive.
        The container will keep the large canvas centered.
      </p>
      <div className={styles.nonClearableContainer}>
        <SignaturePad canvasProps={{className: styles.sigPad}}
          clearOnResize={false}
          ref={(ref) => { this.sigPad = ref }} />
      </div>
      <div>
        <button className={styles.buttons} onClick={this.clear}>
          Clear
        </button>
        <button className={styles.buttons} onClick={this.trim}>
          Trim
        </button>
      </div>
      {trimmedDataURL
        ? <img className={styles.sigImage}
          style={{backgroundImage: 'url(' + trimmedDataURL + ')'}} />
        : null}
    </div>
  }
}

class App extends Component {
  render () {
    return (
      <div>
        <ClearOnResizeExamplePage />
        <NonClearOnResizePage/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
