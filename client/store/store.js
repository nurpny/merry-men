import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import user from './user-store';
import portfolio from './portfolio-store';
import transactions from './transaction-store';
import error from './error-store';
import singleStock from './single-stock-store';

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

export const rootReducer = combineReducers({
  user,
  portfolio,
  transactions,
  error,
  singleStock
});
const store = compose(applyMiddleware(...middlewares))(createStore)(
  rootReducer
);

export const IEX_PUBLIC_KEY = 'pk_0022a78449db4eb2a4fcc320c702993b';
export default store;
