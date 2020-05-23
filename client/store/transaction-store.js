import axios from 'axios'
import { IEX_PUBLIC_KEY } from './store'
import { gettingPortfolio } from './portfolio-store'
import { getUser } from './user-store'
import { BUYSELL_ERROR } from './error-store'

// Action Types
const GET_TRANSACTIONS = 'GET_TRANSACTION'
export const ADD_TRANSACTION = 'ADD_TRANSACTION'

// Initial State
const defaultTransactions = []

// Action Creators
const getTransactions = (transactions) => ({
  type: GET_TRANSACTIONS,
  transactions
})

const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  transaction,
  buySellError: null
})

const buySellError = (errMsg) => ({
  type: BUYSELL_ERROR,
  buySellError: errMsg
})

// Thunk Creators
export const gettingTransactions = () => async (dispatch) => {
  try {
    // get the transaction data from the server
    let { data } = await axios.get(`/api/transactions/`)
    dispatch(getTransactions(data))
  } catch (err) {
    console.error(err)
  }
}

export const buyingSellingStock = (
  symbol,
  quantity,
  userCash,
  buySell,
  portfolio
) => async (dispatch) => {
  symbol = symbol.toUpperCase()
  quantity =
    buySell === 'buy' ? parseInt(quantity, 10) : -parseInt(quantity, 10)

  if (buySell === 'sell') {
    // dispatch error if the user does not have enough stocks to sell in the user's portfolio
    let [pftItem] = portfolio.filter((pftItem) => pftItem.symbol === symbol)
    if (!pftItem) {
      return dispatch(buySellError('You do not own this stock'))
    } else if (pftItem.quantity < Math.abs(quantity)) {
      return dispatch(buySellError('Not enough shares'))
    }
  }
  let price
  try {
    // for this app, assuming that buying/selling happens @ market price (rounded to nearest cent) instead of ask/bid. get the latest price from iex api
    let { data } = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${symbol}/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
    )
    price = Math.round(data * 100)
  } catch (unknownTickerError) {
    // dispatch error if the ticker does not exist
    return dispatch(buySellError('Unknown symbol'))
  }
  try {
    // dispatch error if the user does not have enough cash
    if (buySell === 'buy' && quantity * price > userCash) {
      return dispatch(buySellError('Not enough cash'))
    }
    // record the transaction
    let newTxn = await axios.post(`/api/transactions/`, {
      symbol,
      price,
      quantity
    })
    // update the user's portfolio
    await axios.put(`/api/portfolio/`, { symbol, quantity })
    // update user's cash
    let marketValue = quantity * price
    let user = await axios.put('/api/user', { marketValue })
    dispatch(addTransaction(newTxn.data))
    dispatch(getUser(user.data))
    // update user's portfolio view with updated prices for all
    dispatch(gettingPortfolio())
  } catch (err) {
    return dispatch(buySellError('Something went wrong'))
  }
}

// Reducer
export default function (state = defaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.transactions
    case ADD_TRANSACTION:
      return [action.transaction, ...state]
    default:
      return state
  }
}
