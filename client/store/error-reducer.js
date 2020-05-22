// Action Types
import { ADD_TRANSACTION } from './transaction-store'
export const BUYSELL_ERROR = 'BUY_SELL_ERROR'

// Initial State
const defaultError = {};

export default function errorReducer(state = defaultError, action) {
  switch(action.type) {
    case BUYSELL_ERROR:
      return {...state, buySell: action.buySellError}
    case ADD_TRANSACTION:
      return {...state, buySell: action.buySellError}
  }

  // const { error } = action;
  // // if any errors are fired by the action reators, the error reducer to be triggered;
  // if (error) {
  //   return { errorMsg: error}
  // }
  return state;
}
