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
