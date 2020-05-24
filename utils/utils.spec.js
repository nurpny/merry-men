import convertToUSD from './convert-to-usd'
import getDateOnly from './get-date-only'
import { expect } from 'chai'

describe('convertToUSD Util function', () => {
  it('returns the string dollar representation of cents entered', () => {
    const usd = convertToUSD(155098)
    expect(usd).to.be.a('string')
    expect(usd).to.equal('$1,550.98')
  })
})

describe('getDateOnly Util function', () => {
  it('returns a string date representation of a date object', () => {
    const date = getDateOnly('2020-05-24 13:56:12.832-04')
    expect(date).to.be.a('string')
    expect(date).to.equal('05/24/2020')
  })
})
