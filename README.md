# Stock App 

This is an web app that allows users to create accounts and buy/sell stocks.
The app uses latest prices from iex API(https://iexcloud.io/), and assumes that buying and selling occurs at latest market price (rather than asks/bids).
Each new user is given \$ 5,000 initial cash to trade with.
A user needs to log in or have a valid session view the user's portfolio or transactions.
Portfolio view displays user's portfolio and indicates the changes from the day's opening prices by the color of the stock.
A user can only buy as many stocks as the user's current cash allows, and can only sell as many stocks as the user holds.
Transaction view displays user's transactions from the latest.

## Technologies used

Client: React, Redux, Styled-Components\
Server: Node, Express, PostgreSQL, Sequelize\
Testing: Mocha, Chai, Supertest

## Deployed Site
https://merry-men.herokuapp.com/

## To start the application in dev environment

You need to have PostgreSQL installed on your machine.

```
createdb NYCTTP
npm install
npm run seed
npm run start-dev
```

Open http://localhost:8000 to view in browser.

## To run the Mocha tests

```
createdb NYCTTP-test
npm run start-test
```

## Phase 2
App is built using free plans offered by IEX Cloud, which allows upto 50k messages/mo, and prices for user's portfolio is set to be refreshed every 5 minutes.
In phase 2 of the project, SSE Streaming is to be established for real-time streaming of prices.
