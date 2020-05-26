import axios from 'axios';
import { IEX_PUBLIC_KEY } from './store';

// Thunk Utils
export const getLatestPrice = async (symbol) => {
  // for this app, assuming that buying/selling happens @ market price (rounded to nearest cent) instead of ask/bid. get the latest price from iex api
  let { data } = await axios.get(
    `https://cloud.iexapis.com/stable/stock/${symbol}/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
  );
  return Math.round(data * 100);
};

export const updateDBs = async (symbol, price, quantity) => {
  // update the user's portfolio
  await axios.put(`/api/portfolio`, { symbol, quantity });
  // update user's cash
  let user = await axios.put('/api/user', { marketValue: quantity * price });
  // record the transaction
  let newTxn = await axios.post(`/api/transactions`, {
    symbol,
    price,
    quantity
  });
  return [newTxn.data, user.data];
};
