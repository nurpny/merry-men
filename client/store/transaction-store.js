import axios from 'axios'
const IEX_PUBLIC_KEY = "pk_f5f64fabf63c44f4ac83a9e955f59e3e"

// Action Types
const GET_TRANSACTIONS = 'GET_TRANSACTION'

// Initial State
const defaultTransactions = []

// Action Creators
const getTransactions = transactions => ({ type: GET_TRANSACTIONS, transactions })


// Thunk Creators
export const gettingTransactions = (userId) => async dispatch => {
  try {
    // get the transaction data from the server
    let { data } = await axios.get(`/api/transactions/${userId}`)
    dispatch(getTransactions(data))

  } catch (err) {
    console.error(err)
  }
}



// Reducer
export default function (state = defaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.transactions
    default:
      return state
  }
}
