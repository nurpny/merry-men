import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { StyledDivContainer } from '../themes/StyledDivContainer';
import { buyingSellingStock } from '../store/transaction-store';
import { StyledButton } from '../themes/StyledButton';

import Quote from './Quote';
import Quantity from './Quantity';

const StyledButtonsContainer = styled.section`
  margin: 20px 10px 10px 10px;
  padding: 0px;
  display: flex;
  justify-content: space-around;
  width: 200px;
`;

export const BuySell = (props) => {
  // buy/sell buttons will be enabled only if buyValid/sellValid is true
  const [buyValid, setBuyValid] = useState(false);
  const [sellValid, setSellValid] = useState(false);

  const validateBuy = () => {
    // user cannot buy more of the stock than the cash limits
    return (
      props.singleStock.quantity &&
      props.singleStock.price * props.singleStock.quantity < props.user.cash
    );
  };

  const validateSell = () => {
    // user cannot sell more of the stock than the user has in the portfolio
    let availablePortfolio = props.portfolio.filter(
      (pftItem) => pftItem.symbol === props.singleStock.symbol
    );
    return (
      props.singleStock.quantity &&
      availablePortfolio.length &&
      props.singleStock.quantity <= availablePortfolio[0].quantity
    );
  };

  useEffect(() => {
    if (validateBuy()) setBuyValid(true);
    if (validateSell()) setSellValid(true);
  });

  const handleBuy = (evt) => {
    evt.preventDefault();
    props.onSubmit(
      props.singleStock.symbol,
      props.singleStock.quantity,
      props.user.cash,
      'buy'
    );
  };

  const handleSell = (evt) => {
    evt.preventDefault();
    props.onSubmit(
      props.singleStock.symbol,
      props.singleStock.quantity,
      props.user.cash,
      'sell'
    );
  };

  return (
    <StyledDivContainer>
      <Quote />
      <Quantity />

      <StyledButtonsContainer>
        <form onSubmit={handleBuy}>
          <StyledButton
            type="submit"
            name="buy"
            buttonColor="red"
            disabled={!buyValid}
          >
            Buy
          </StyledButton>
        </form>

        <form onSubmit={handleSell}>
          <StyledButton
            type="submit"
            name="sell"
            buttonColor="green"
            disabled={!sellValid}
          >
            Sell
          </StyledButton>
        </form>
      </StyledButtonsContainer>

      <div>{props.error.buySell && props.error.buySell}</div>
    </StyledDivContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  portfolio: state.portfolio,
  error: state.error,
  singleStock: state.singleStock
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (symbol, quantity, userCash, buySell) =>
    dispatch(buyingSellingStock(symbol, quantity, userCash, buySell))
});

export default connect(mapStateToProps, mapDispatchToProps)(BuySell);
