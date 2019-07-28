import { describe, test, expect } from 'jest'
import { mount } from 'enzyme'
import React from 'react'

import SignatureCanvas from './index.js'
import { dotData } from '../test-utils/fixtures.js'

test('mounts canvas and instance properly', () => {
  const wrapper = mount(<SignatureCanvas />)
  expect(wrapper.exists('canvas')).toBe(true)
  const instance = wrapper.instance()
  expect(instance.isEmpty()).toBe(true)
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
    rSigPad.fromData(dotData)
    const rData = rSigPad.toData()
    expect(rData).toBe(dotData)
    expect(rData).toBe(sigPad.toData())

    // test reverse as both froms should be equivalent
    sigPad.fromData(dotData)
    const data = sigPad.toData()
    expect(rData).toBe(data)
    expect(rSigPad.toData()).toBe(data)
  })

  test('toDataURL should be equivalent', () => {
    rSigPad.fromData(dotData)
    expect(rSigPad.toDataURL()).toBe(sigPad.toDataURL())
    expect(rSigPad.toDataURL('image/jpg')).toBe(sigPad.toDataURL('image/jpg'))
    expect(rSigPad.toDataURL('image/jpg', 0.7)).toBe(sigPad.toDataURL('image/jpg', 0.7))
    expect(rSigPad.toDataURL('image/svg+xml')).toBe(sigPad.toDataURL('image/svg+xml'))
  })

  test('fromDataURL should be equivalent', () => {
    // convert data fixture to dataURL
    rSigPad.fromData(dotData)
    const dotDataURL = rSigPad.toDataURL()

    rSigPad.fromDataURL(dotDataURL)
    const rDataURL = rSigPad.toDataURL()
    expect(rDataURL).toBe(dotDataURL)
    expect(rDataURL).toBe(sigPad.toDataURL())

    // test reverse as both froms should be equivalent
    sigPad.fromDataURL(dotDataURL)
    const dataURL = sigPad.toDataURL()
    expect(rDataURL).toBe(dataURL)
    expect(rSigPad.toDataURL()).toBe(dataURL)
  })

  test('isEmpty & clear should be equivalent', () => {
    rSigPad.fromData(dotData)
    let isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(false)
    expect(isEmpty).toBe(sigPad.isEmpty())

    // both empty after clear
    rSigPad.clear()
    isEmpty = rSigPad.isEmpty()
    expect(isEmpty).toBe(true)
    expect(isEmpty).toBe(sigPad.isEmpty())

    // test reverse
    sigPad.fromData(dotData)
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
