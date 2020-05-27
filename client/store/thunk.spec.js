import { expect } from 'chai';

import { GET_USER } from './user-store';
import { GET_PORTFOLIO, gettingPortfolio } from './portfolio-store';
import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  buyingSellingStock,
  gettingTransactions
} from './transaction-store';
import { getLatestPrice } from './thunk-utils';
import { BUYSELL_ERROR } from './error-store';
import { IEX_PUBLIC_KEY } from './store';

import axios from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);
const initialState = {
  error: {},
  portfolio: [],
  transactions: [],
  user: {}
};

import { testTransactions } from './actioncreators.spec';
import { testPortfolio } from './actioncreators.spec';

describe('Thunk creators', () => {
  // check the actions dispatched by mocking the redux store

  let mockAxios;
  let store;

  beforeEach(() => {
    mockAxios = new MockAxiosAdapter(axios);
    store = mockStore(initialState); // create a new store for each test
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('gettingTransactions thunk creator', () => {
    it('dispatching gettingTransactions thunk results in dispatching a GET_TRANSACTIONS action', async () => {
      mockAxios.onGet('/api/transactions').replyOnce(200, testTransactions);
      // mock axios will respond with status code 200 and transactions defined above
      await store.dispatch(gettingTransactions());
      const actions = store.getActions();
      expect(actions[0].type).to.equal(GET_TRANSACTIONS);
      expect(actions[0].transactions).to.deep.equal(testTransactions);
    });
  });

  describe('gettingPortfolio thunk creator', () => {
    // below is abbreviated version of data you can expect from iex api
    const testIexData = {
      AAPL: {
        quote: {
          symbol: 'AAPL',
          open: 315.9,
          high: 319.23,
          latestPrice: 318.89
        }
      },
      NFLX: {
        quote: {
          symbol: 'NFLX',
          open: 436.98,
          high: 439.09,
          latestPrice: 429.32
        }
      }
    };

    const expectedTestPortfolio = [
      {
        id: 1,
        symbol: 'AAPL',
        quantity: 5,
        userId: 1,
        mv: 159445,
        openPrice: 31590,
        price: 31889
      },
      {
        id: 2,
        symbol: 'NFLX',
        quantity: 10,
        userId: 1,
        mv: 429320,
        openPrice: 43698,
        price: 42932
      }
    ];

    it('dispatching gettingPortfolio thunk results in dispatching a GET_PORTFOLIO action', async () => {
      mockAxios.onGet('/api/portfolio').replyOnce(200, testPortfolio);
      // mockaxios will respond with status code 200 and transactions defined above
      mockAxios
        .onGet(
          `https://cloud.iexapis.com/stable/stock/market/batch?symbols=AAPL,NFLX&types=quote&token=${IEX_PUBLIC_KEY}`
        )
        .replyOnce(200, testIexData);
      await store.dispatch(gettingPortfolio());
      const actions = store.getActions();
      expect(actions[0].type).to.equal(GET_PORTFOLIO);
      expect(actions[0].portfolio).to.deep.equal(expectedTestPortfolio);
    });
  });

  describe('buyingSellingStock', () => {
    // check the actions dispatched by mocking the redux store
    let mockAxios;
    let store;

    beforeEach(() => {
      mockAxios = new MockAxiosAdapter(axios);
      store = mockStore(initialState); // create a new store for each test
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('if the user does not own stocks the user wants to sell, it dispatches a buySellError', async () => {
      await store.dispatch(
        buyingSellingStock('SPOT', '1000', 10000, 'sell', testPortfolio)
      );
      const actions = store.getActions();
      expect(actions[0].type).to.equal(BUYSELL_ERROR);
      expect(actions[0].buySellError).to.equal('You do not own this stock');
    });

    it('if the user enters an unknown ticker, it dispatches a buySellError', async () => {
      mockAxios
        .onGet(
          `https://cloud.iexapis.com/stable/stock/SPOTXXXX/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
        )
        .replyOnce(404);
      await store.dispatch(
        buyingSellingStock('SPOTXXXX', '1000', 10000, 'buy', testPortfolio)
      );
      const actions = store.getActions();
      expect(actions[0].type).to.equal(BUYSELL_ERROR);
      expect(actions[0].buySellError).to.equal('Unknown symbol');
    });

    it("if the user wants to buy more stocks than the user's cash allows, it dispatches a buySellError", async () => {
      mockAxios
        .onGet(
          `https://cloud.iexapis.com/stable/stock/SPOT/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
        )
        .replyOnce(200, 190.17);
      await store.dispatch(
        buyingSellingStock('SPOT', '1000', 2000, 'buy', testPortfolio)
      );
      const actions = store.getActions();
      expect(actions[0].type).to.equal(BUYSELL_ERROR);
      expect(actions[0].buySellError).to.equal('Not enough cash');
    });

    it("if the user buys stocks within the user's cash limits, it dispatches addTransaction & getUser actions and calls gettingPortfolio", async () => {
      // below is the response you'd expect from /api/transactions if the transaction was successful
      const txnRes = {
        id: 1,
        symbol: 'SPOT',
        price: 19017,
        quantity: 10,
        userId: 1
      };

      // below is the response you'd expect from /api/user if the transaction was successful
      const userRes = {
        id: 1,
        name: 'jane',
        email: 'jane@email.com',
        cash: 190170
      };

      // below is the response you'd expect from /api/portfolio if the transaction was successful
      const portfRes = [
        {
          id: 1,
          symbol: 'SPOT',
          quantity: 10,
          userId: 1,
          mv: 190170,
          openPrice: 19200,
          price: 19017
        }
      ];

      // below is the abbreviation version of data you'd expect from iex api for SPOT
      const testIexData = {
        SPOT: {
          quote: { symbol: 'SPOT', open: 192, latestPrice: 190.17 }
        }
      };

      mockAxios
        .onGet(
          `https://cloud.iexapis.com/stable/stock/SPOT/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
        )
        .replyOnce(200, 190.17);
      mockAxios.onPost('/api/transactions').replyOnce(200, txnRes);
      mockAxios.onPut('/api/portfolio').replyOnce(200);
      mockAxios.onPut('/api/user').replyOnce(200, userRes);
      mockAxios.onGet('/api/portfolio').replyOnce(200, portfRes);
      mockAxios
        .onGet(
          `https://cloud.iexapis.com/stable/stock/market/batch?symbols=SPOT&types=quote&token=${IEX_PUBLIC_KEY}`
        )
        .replyOnce(200, testIexData);

      await store.dispatch(
        buyingSellingStock('SPOT', '10', 200000, 'buy', testPortfolio)
      );
      const actions = store.getActions();
      expect(actions.length).to.equal(2);
      expect(actions).to.deep.equal([
        {
          type: ADD_TRANSACTION,
          transaction: {
            id: 1,
            symbol: 'SPOT',
            price: 19017,
            quantity: 10,
            userId: 1
          },
          buySellError: null
        },
        {
          type: GET_USER,
          user: { id: 1, name: 'jane', email: 'jane@email.com', cash: 190170 },
          loginError: null,
          signUpError: null
        }
      ]);
    });
  });

  describe('Thunks Utils functions', () => {
    let mockAxios;

    beforeEach(() => {
      mockAxios = new MockAxiosAdapter(axios);
    });

    describe('getLatestPrice', () => {
      it('if input is an unknown ticker, it throws an error', (done) => {
        // mockAxios will respond with 404 status
        mockAxios
          .onGet(
            `https://cloud.iexapis.com/stable/stock/SPOTXXXX/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
          )
          .replyOnce(404);

        getLatestPrice('SPOTXXXX')
          .then(() => {
            expect.fail();
            done();
          })
          .catch((err) => {
            expect(err.response.status).to.be.equal(404);
            done();
          });
      });

      it('if input is a known ticker, it returns the price in cents', async () => {
        // mockAxios will respond with 200 status and a price
        mockAxios
          .onGet(
            `https://cloud.iexapis.com/stable/stock/SPOT/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
          )
          .replyOnce(200, 190.17);

        let price = await getLatestPrice('SPOT');
        expect(price).to.be.equal(19017);
      });
    });

    describe('getLatestPrice', () => {
      it('if input is an unknown ticker, it throws an error', (done) => {
        // mockAxios will respond with 404 status
        mockAxios
          .onGet(
            `https://cloud.iexapis.com/stable/stock/SPOTXXXX/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
          )
          .replyOnce(404);

        getLatestPrice('SPOTXXXX')
          .then(() => {
            expect.fail();
            done();
          })
          .catch((err) => {
            expect(err.response.status).to.be.equal(404);
            done();
          });
      });

      it('if input is a known ticker, it returns the price in cents', async () => {
        // mockAxios will respond with 200 status and a price
        mockAxios
          .onGet(
            `https://cloud.iexapis.com/stable/stock/SPOT/quote/latestPrice?token=${IEX_PUBLIC_KEY}`
          )
          .replyOnce(200, 190.17);

        let price = await getLatestPrice('SPOT');
        expect(price).to.be.equal(19017);
      });
    });
  });
});
