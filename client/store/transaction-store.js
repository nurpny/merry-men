import axios from 'axios';
import { getLatestPrice, updateDBs } from './thunk-utils';
import { gettingPortfolio } from './portfolio-store';
import { getUser } from './user-store';
import { BUYSELL_ERROR } from './error-store';

// Action Types
export const GET_TRANSACTIONS = 'GET_TRANSACTIONS';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';

// Initial State
const defaultTransactions = [];

// Action Creators
export const getTransactions = (transactions) => ({
  type: GET_TRANSACTIONS,
  transactions
});

export const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  transaction,
  buySellError: null,
  singleStock: {}
});

export const buySellError = (errMsg) => ({
  type: BUYSELL_ERROR,
  buySellError: errMsg
});

// Thunk Creators
export const gettingTransactions = () => async (dispatch) => {
  try {
    // get the transaction data from the server
    let { data } = await axios.get(`/api/transactions`);
    dispatch(getTransactions(data));
  } catch (err) {
    console.error(err);
  }
};

export const buyingSellingStock = (
  symbol,
  quantity,
  userCash,
  buySell
) => async (dispatch) => {
  symbol = symbol.toUpperCase();
  quantity =
    buySell === 'buy' ? parseInt(quantity, 10) : -parseInt(quantity, 10);

  try {
    // check the prices again to ensure that the user has enough cash for the latest price
    // dispatch error if the user does not have enough cash
    let price = await getLatestPrice(symbol);
    if (buySell === 'buy' && quantity * price > userCash) {
      return dispatch(buySellError('Not enough cash'));
    }
    let [newTxn, user] = await updateDBs(symbol, price, quantity);
    dispatch(addTransaction(newTxn));
    dispatch(getUser(user));
    // update user's portfolio view with updated prices for all
    dispatch(gettingPortfolio());
  } catch (err) {
    return dispatch(buySellError('Something went wrong'));
  }
};

// Reducer
export default (state = defaultTransactions, action) => {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.transactions;
    case ADD_TRANSACTION:
      return [action.transaction, ...state];
    default:
      return state;
  }
};
