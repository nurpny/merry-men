import { createStore, combineReducers, applyMiddleware, compose }  from 'redux';
import thunkMiddleware from 'redux-thunk'
import user from './user-store'
import portfolio from './portfolio-store'

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const rootReducer = combineReducers({user, portfolio})
const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer);

export default store
