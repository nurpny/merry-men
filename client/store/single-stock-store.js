import { getLatestPrice } from './thunk-utils';
import { BUYSELL_ERROR } from './error-store';

// Action Types
export const SELECT_STOCK = 'SELECT_STOCK';
export const ADD_QUANTITY = 'ADD_QUANTITY';

// Initial State
const defaultStock = {};

// Action Creators
export const selectStock = (stock) => ({
  type: SELECT_STOCK,
  stock,
  buySellError: null
});

export const selectStockError = (errMsg) => ({
  type: BUYSELL_ERROR,
  buySellError: errMsg
});

export const addQuantity = (quantity) => ({
  type: ADD_QUANTITY,
  quantity
});

// Thunk Creators
export const selectingStock = (symbol) => async (dispatch) => {
  try {
    let price = await getLatestPrice(symbol);
    dispatch(selectStock({ symbol, price }));
  } catch (err) {
    return dispatch(selectStockError('Unknown symbol'));
  }
};

// Reducer
export default (state = defaultStock, action) => {
  switch (action.type) {
    case SELECT_STOCK:
      return action.stock;
    case ADD_QUANTITY:
      return { ...state, quantity: action.quantity };
    default:
      return state;
  }
};
