import { expect } from 'chai'
import userReducer, { GET_USER, REMOVE_USER } from './user-store'
import portfolioReducer, {
  GET_PORTFOLIO,
  UPDATE_PORTFOLIO
} from './portfolio-store'
import transactionReducer, {
  GET_TRANSACTIONS,
  ADD_TRANSACTION
} from './transaction-store'
import errorReducer, {
  LOGIN_ERROR,
  SIGNUP_ERROR,
  BUYSELL_ERROR
} from './error-store'

describe('reducers', () => {
  describe('transaction reducer', () => {
    let initialState
    beforeEach(() => {
      initialState = []
    })
    const txn1 = { id: 4, symbol: 'SPOT', quantity: 50, price: 18990 }
    const txn2 = { id: 5, symbol: 'AMZN', quantity: 1, price: 246800 }
    const txn3 = { id: 6, symbol: 'JBLU', quantity: 100, price: 900 }

    it('ADD_TRANSACTION returns an updated state with new transaction added to the list of transactions', () => {
      initialState = [txn1]
      // when adding addedTxn to initialState with a new transaction, expect both transactions to be in the updated state
      // addedtransaction will be added to the beginning of the array

      const newState = transactionReducer(initialState, {
        type: ADD_TRANSACTION,
        transaction: txn2
      })
      expect(newState.length).to.equal(2)
      expect(newState.map((txn) => txn.symbol)).to.deep.equal(['AMZN', 'SPOT'])
    })

    it('GET_TRANSACTIONS returns a new state with transactions', () => {
      initialState = [txn1]
      // when getting transactions, expect state to be over-written with transactions in the action creator
      // new state array will be in the same order as the transactions received by get api

      const newState = transactionReducer(initialState, {
        type: GET_TRANSACTIONS,
        transactions: [txn2, txn3]
      })
      expect(newState.length).to.equal(2)
      expect(newState.map((txn) => txn.symbol)).to.deep.equal(['AMZN', 'JBLU'])
    })
  })

  describe('portfolio reducer', () => {
    let initialState
    beforeEach(() => {
      initialState = []
    })
    const pftItem1 = { id: 1, symbol: 'AAPL', quantity: 5, userId: 1 }
    const pftItem2 = { id: 2, symbol: 'NFLX', quantity: 10, userId: 1 }
    const pftItem3 = { id: 3, symbol: 'SPOT', quantity: 20, userId: 1 }
    const pftItem4 = { id: 1, symbol: 'AAPL', quantity: 25, userId: 1 }

    it('GET_PORTFOLIO returns a new state with portfolio items', () => {
      initialState = [pftItem1]
      // when getting transactions, expect state to be over-written with portfolio array from the action creator
      // new state array will be in the same order as the portfolio items received by get api

      const newState = portfolioReducer(initialState, {
        type: GET_PORTFOLIO,
        portfolio: [pftItem2, pftItem3]
      })
      expect(newState.length).to.equal(2)
      expect(newState.map((pft) => pft.symbol)).to.deep.equal(['NFLX', 'SPOT'])
    })

    it('UPDATE_PORTFOLIO returns an updated state with an updated portfolio item in the list', () => {
      initialState = [pftItem1, pftItem2]
      // when updating a portfolio Item in the initialState with updated data
      // only the partciular portfolio item should be updated
      const newState = portfolioReducer(initialState, {
        type: UPDATE_PORTFOLIO,
        pftItem: pftItem4
      })
      expect(newState.length).to.equal(2)
      expect(newState.map((pftItem) => pftItem.symbol)).to.deep.equal([
        'AAPL',
        'NFLX'
      ])
      expect(newState[0].quantity).to.equal(25)
      expect(newState[1].quantity).to.equal(10)
    })

    it('UPDATE_PORTFOLIO returns an updated state with additional portfolio item in the list', () => {
      initialState = [pftItem1, pftItem2]
      // when updating a portfolio Item in the initialState with new symbol, it adds the additional item to the portfolio array
      const newState = portfolioReducer(initialState, {
        type: UPDATE_PORTFOLIO,
        pftItem: pftItem3
      })
      expect(newState.length).to.equal(3)
      expect(newState.map((pftItem) => pftItem.symbol)).to.deep.equal([
        'SPOT',
        'AAPL',
        'NFLX'
      ])
      expect(newState[0].quantity).to.equal(20)
    })
  })

  describe('user reducer', () => {
    let initialState
    beforeEach(() => {
      initialState = {}
    })
    const user1 = {
      id: 20,
      name: 'jane',
      email: 'jane@gmail.com',
      cash: '40000'
    }

    it('GET_USER returns an updated state with new user object', () => {
      const newState = userReducer(initialState, {
        type: GET_USER,
        user: user1
      })
      expect(newState).to.deep.equal(user1)
    })

    it('REMOVE_USER return an empty object as the new state', () => {
      initialState = user1
      const newState = userReducer(initialState, {
        type: REMOVE_USER
      })
      expect(newState).to.deep.equal({})
    })
  })

  describe('error reducer', () => {
    let initialState
    beforeEach(() => {
      initialState = {}
    })
    const buySellErrMsg = 'You do not own this stock'
    const loginErrorMsg = 'Incorrect email and/or password'
    const signUpErrorMsg = 'User already exists'

    it('BUYSELL_ERROR returns a new state with buysellErr', () => {
      const newState = errorReducer(initialState, {
        type: BUYSELL_ERROR,
        buySellError: buySellErrMsg
      })
      expect(newState).to.deep.equal({ buySell: buySellErrMsg })
    })

    it('LOGIN_ERROR returns a new state with loginError', () => {
      const newState = errorReducer(initialState, {
        type: LOGIN_ERROR,
        loginError: loginErrorMsg
      })
      expect(newState).to.deep.equal({ login: loginErrorMsg })
    })

    it('SIGNUP_ERROR returns a new state with signupError', () => {
      const newState = errorReducer(initialState, {
        type: SIGNUP_ERROR,
        signUpError: signUpErrorMsg
      })
      expect(newState).to.deep.equal({ signUp: signUpErrorMsg })
    })
  })
})
