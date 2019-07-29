// export Jest as an ES Module (https://github.com/facebook/jest/pull/7571#issuecomment-498634094)
/* global jest */
export default jest
export const { expect, test, describe, it } = global
