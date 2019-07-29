import { describe, test, expect } from 'jest'
import { mount } from 'enzyme'
import React from 'react'

import SignatureCanvas from './index.js'
import { propsF, dotF } from '../test-utils/fixtures.js'

test('mounts canvas and instance properly', () => {
  const wrapper = mount(<SignatureCanvas />)
  expect(wrapper.exists('canvas')).toBe(true)
  const instance = wrapper.instance()
  expect(instance.isEmpty()).toBe(true)
})

describe('props are set and updated correctly', () => {
  test('default props should match', () => {
    const instance = mount(<SignatureCanvas />).instance()
    expect(instance.props).toStrictEqual(SignatureCanvas.defaultProps)
  })

  test('mounted initial props and options should match', () => {
    const instance = mount(<SignatureCanvas {...propsF.all} />).instance()
    const sigPad = instance.getSignaturePad()

    expect(instance.props).toMatchObject(propsF.all)
    expect(sigPad).toMatchObject(propsF.sigPadOptions)
  })

  test('updated props and options should match', () => {
    const wrapper = mount(<SignatureCanvas />)
    const instance = wrapper.instance()
    const sigPad = instance.getSignaturePad()

    // default props and options should not match new ones
    expect(instance.props).not.toMatchObject(propsF.all)
    expect(sigPad).not.toMatchObject(propsF.sigPadOptions)

    // should match when updated
    wrapper.setProps(propsF.all)
    expect(instance.props).toMatchObject(propsF.all)
    expect(sigPad).toMatchObject(propsF.sigPadOptions)
  })
})

describe('SigCanvas wrapper methods return equivalent to SigPad', () => {
  const rSigPad = mount(<SignatureCanvas />).instance()
  const sigPad = rSigPad.getSignaturePad()

  test('toData should be equivalent', () => {
    const rData = rSigPad.toData()
    expect(rData).toStrictEqual([])
    expect(rData).toBe(sigPad.toData())
  })

  test('fromData should be equivalent', () => {
    rSigPad.fromData(dotF.data)
    const rData = rSigPad.toData()
    expect(rData).toBe(dotF.data)
    expect(rData).toBe(sigPad.toData())

    // test reverse as both froms should be equivalent
    sigPad.fromData(dotF.data)
    const data = sigPad.toData()
    expect(rData).toBe(data)
    expect(rSigPad.toData()).toBe(data)
  })

  test('toDataURL should be equivalent', () => {
    rSigPad.fromData(dotF.data)
    expect(rSigPad.toDataURL()).toBe(sigPad.toDataURL())
    expect(rSigPad.toDataURL('image/jpg')).toBe(sigPad.toDataURL('image/jpg'))
    expect(rSigPad.toDataURL('image/jpg', 0.7)).toBe(sigPad.toDataURL('image/jpg', 0.7))
    expect(rSigPad.toDataURL('image/svg+xml')).toBe(sigPad.toDataURL('image/svg+xml'))
  })

  test('fromDataURL should be equivalent', () => {
    // convert data fixture to dataURL
    rSigPad.fromData(dotF.data)
    const dotFDataURL = rSigPad.toDataURL()

    rSigPad.fromDataURL(dotFDataURL)
    const rDataURL = rSigPad.toDataURL()
    expect(rDataURL).toBe(dotFDataURL)
    expect(rDataURL).toBe(sigPad.toDataURL())

    // test reverse as both froms should be equivalent
    sigPad.fromDataURL(dotFDataURL)
    const dataURL = sigPad.toDataURL()
    expect(rDataURL).toBe(dataURL)
    expect(rSigPad.toDataURL()).toBe(dataURL)
  })

  test('isEmpty & clear should be equivalent', () => {
    rSigPad.fromData(dotF.data)
    let isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(false)
    expect(isEmpty).toBe(sigPad.isEmpty())

    // both empty after clear
    rSigPad.clear()
    isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(true)
    expect(isEmpty).toBe(sigPad.isEmpty())

    // test reverse
    sigPad.fromData(dotF.data)
    isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(false)
    expect(isEmpty).toBe(sigPad.isEmpty())

    // both empty after internal sigPad clear
    sigPad.clear()
    isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(true)
    expect(isEmpty).toBe(sigPad.isEmpty())
  })
})

describe('get methods return correct canvases', () => {
  const instance = mount(
    <SignatureCanvas canvasProps={dotF.canvasProps} />
  ).instance()
  instance.fromData(dotF.data)

  test('getCanvas should return the same underlying canvas', () => {
    const canvas = instance.getCanvas()
    expect(instance.toDataURL()).toBe(canvas.toDataURL())
  })

  test('getTrimmedCanvas should return a trimmed canvas', () => {
    const trimmed = instance.getTrimmedCanvas()
    expect(trimmed.width).toBe(dotF.trimmedSize.width)
    expect(trimmed.height).toBe(dotF.trimmedSize.height)
  })
})
