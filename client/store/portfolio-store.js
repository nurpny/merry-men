import axios from 'axios'
import { IEX_PUBLIC_KEY } from './store'

// Action Types
const GET_PORTFOLIO = 'GET_PORTFOLIO'
const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'

// Initial State
const defaultPortfolio = []

// Action Creators
const getPortfolio = portfolio => ({
  type: GET_PORTFOLIO,
  portfolio
})

export const updatePortfolio = pftItem => ({
  type: UPDATE_PORTFOLIO,
  pftItem
})

// Thunk Creators
export const gettingPortfolio = (userId) => async dispatch => {
  try {
    // get the portfolio data from the server
    let { data } = await axios.get(`/api/portfolio/${userId}`)

    // enrich the portfolio data from IEX
    await Promise.all(data.map(async pftItem => {
      let { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${pftItem.symbol}/quote/latestPrice?token=${IEX_PUBLIC_KEY}`)
      pftItem.price = Math.round(data * 100)
      pftItem.mv = pftItem.price * pftItem.quantity
    }))
    dispatch(getPortfolio(data))

  } catch (err) {
    console.error(err)
  }
}

// Reducer
export default function (state = defaultPortfolio, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.portfolio
    case UPDATE_PORTFOLIO:
      return [action.pftItem, ...state.filter(pftItem => pftItem.symbol !== action.pftItem.symbol)]
    default:
      return state;
  }
}
