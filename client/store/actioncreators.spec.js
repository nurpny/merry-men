import { expect } from 'chai'

import {
  GET_USER,
  REMOVE_USER,
  getUser,
  removeUser,
  loginError,
  signUpError
} from './user-store'
import {
  GET_PORTFOLIO,
  UPDATE_PORTFOLIO,
  getPortfolio,
  updatePortfolio
} from './portfolio-store'
import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  getTransactions,
  addTransaction,
  buySellError
} from './transaction-store'
import { LOGIN_ERROR, SIGNUP_ERROR, BUYSELL_ERROR } from './error-store'

export const testTransactions = [
  {
    id: 1,
    symbol: 'SPOT',
    quantity: 10,
    price: 18990,
    createdAt: '2020-05-23 00:34:29.5-04'
  },
  {
    id: 2,
    symbol: 'NFLX',
    quantity: 10,
    price: 45230,
    createdAt: '2020-05-23 12:34:29.5-04'
  },
  {
    id: 3,
    symbol: 'AAPL',
    quantity: 10,
    price: 31075,
    createdAt: '2020-05-23 00:34:29.5-04'
  }
]

export const testTransaction = {
  id: 4,
  symbol: 'SPOT',
  quantity: 50,
  price: 18990
}

export const testPortfolio = [
  { id: 1, symbol: 'AAPL', quantity: 5, userId: 1 },
  { id: 2, symbol: 'NFLX', quantity: 10, userId: 1 }
]

describe('Action creators', () => {
  // tests that action creators return plain objects with the right actions

  // Action creators from user store
  describe('getUser', () => {
    it('returns properly formatted action', () => {
      const userExample = {
        id: 20,
        name: 'jane',
        email: 'jane@gmail.com',
        cash: '40000'
      }
      expect(getUser(userExample)).to.be.deep.equal({
        type: GET_USER,
        user: userExample,
        loginError: null,
        signUpError: null
      })
    })
  })

  describe('removeUser', () => {
    it('returns properly formatted action', () => {
      expect(removeUser()).to.be.deep.equal({
        type: REMOVE_USER
      })
    })
  })

  describe('loginError', () => {
    it('returns properly formatted action', () => {
      const errMsg = 'Incorrect Login'
      expect(loginError(errMsg)).to.be.deep.equal({
        type: LOGIN_ERROR,
        loginError: errMsg
      })
    })
  })

  describe('signupError', () => {
    it('returns properly formatted action', () => {
      const errMsg = 'Duplicate users'
      expect(signUpError(errMsg)).to.be.deep.equal({
        type: SIGNUP_ERROR,
        signUpError: errMsg
      })
    })
  })

  // Action creators from portfolio store
  describe('getPortfolio', () => {
    it('returns properly formatted action', () => {
      expect(getPortfolio(testPortfolio)).to.be.deep.equal({
        type: GET_PORTFOLIO,
        portfolio: testPortfolio
      })
    })
  })

  describe('updatePortfolio', () => {
    it('returns properly formatted action', () => {
      const pftItem = { id: 1, symbol: 'AAPL', quantity: 5, userId: 1 }
      expect(updatePortfolio(pftItem)).to.be.deep.equal({
        type: UPDATE_PORTFOLIO,
        pftItem: pftItem
      })
    })
  })

  // Action creators from transactions store
  describe('getTransactions', () => {
    it('returns properly formatted action', () => {
      expect(getTransactions(testTransactions)).to.be.deep.equal({
        type: GET_TRANSACTIONS,
        transactions: testTransactions
      })
    })
  })

  describe('addTransaction', () => {
    it('returns properly formatted action', () => {
      expect(addTransaction(testTransaction)).to.be.deep.equal({
        type: ADD_TRANSACTION,
        transaction: testTransaction,
        buySellError: null
      })
    })
  })

  describe('buySellError', () => {
    it('returns properly formatted action', () => {
      const errorMsg = 'Not enough shares'
      expect(buySellError(errorMsg)).to.be.deep.equal({
        type: BUYSELL_ERROR,
        buySellError: errorMsg
      })
    })
  })
})
