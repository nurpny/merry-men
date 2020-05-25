import axios from 'axios';
import { IEX_PUBLIC_KEY } from './store';

// Action Types
export const GET_PORTFOLIO = 'GET_PORTFOLIO';
export const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO';

// Initial State
const defaultPortfolio = [];

// Action Creators
export const getPortfolio = (portfolio) => ({
  type: GET_PORTFOLIO,
  portfolio
});

export const updatePortfolio = (pftItem) => ({
  type: UPDATE_PORTFOLIO,
  pftItem
});

// Thunk Creators
export const gettingPortfolio = () => async (dispatch) => {
  try {
    // get the portfolio data from the server
    let pftData = await axios.get(`/api/portfolio`);

    // if empty portfolio data, dispatch an empty list
    if (!pftData.data.length) return dispatch(getPortfolio(pftData.data));

    // enrich the portfolio data with data from IEX
    // turn portfolio data to a chained string of symbols
    let symStr = pftData.data.map((item) => item.symbol).join(',');

    let iexData = await axios.get(
      `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symStr}&types=quote&token=${IEX_PUBLIC_KEY}`
    );

    let enrichedPftData = pftData.data.map((pftItem) => {
      return {
        ...pftItem,
        price: Math.round(iexData.data[pftItem.symbol].quote.latestPrice * 100),
        mv: Math.round(
          pftItem.quantity *
            iexData.data[pftItem.symbol].quote.latestPrice *
            100
        ),
        openPrice: Math.round(iexData.data[pftItem.symbol].quote.open * 100)
      };
    });

    dispatch(getPortfolio(enrichedPftData));
  } catch (err) {
    console.error(err);
  }
};

// Reducer
export default (state = defaultPortfolio, action) => {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.portfolio;
    case UPDATE_PORTFOLIO:
      return [
        action.pftItem,
        ...state.filter((pftItem) => pftItem.symbol !== action.pftItem.symbol)
      ];
    default:
      return state;
  }
};
