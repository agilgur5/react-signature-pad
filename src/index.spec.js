import { test, expect } from 'jest'
import { mount } from 'enzyme'
import React from 'react'

import SignatureCanvas from './index.js'

test('mounts canvas and instance properly', () => {
  const wrapper = mount(<SignatureCanvas />)
  expect(wrapper.exists('canvas')).toBe(true)
  const instance = wrapper.instance()
  expect(instance.isEmpty()).toBe(true)
})
