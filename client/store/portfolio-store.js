import axios from 'axios'
const IEX_PUBLIC_KEY = "pk_f5f64fabf63c44f4ac83a9e955f59e3e"

// Action Types
const GET_PORTFOLIO = 'GET_PORTFOLIO'

// Initial State
const defaultPortfolio = []

// Action Creators
const getPortfolio = portfolio => ({ type: GET_PORTFOLIO, portfolio })


// Thunk Creators
export const gettingPortfolio = (userId) => async dispatch => {
  try {
    // get the portfolio data from the server
    let { data } = await axios.get(`/api/portfolio/${userId}`)

    // enrich the portfolio data from IEX
    await Promise.all(data.map(async pftItem => {
     let {data} = await axios.get(`https://cloud.iexapis.com/stable/stock/${pftItem.symbol}/quote/latestPrice?token=${IEX_PUBLIC_KEY}`)
     pftItem.price = data
     pftItem.mv = Math.round(pftItem.price * 100 * pftItem.quantity)/100
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
    default:
      return state
  }
}
