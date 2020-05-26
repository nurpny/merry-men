import React from 'react';
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
  const handleBuy = (evt) => {
    evt.preventDefault();
    props.onSubmit(
      props.singleStock.symbol,
      props.singleStock.quantity,
      props.user.cash,
      'buy',
      props.portfolio
    );
  };

  const handleSell = (evt) => {
    evt.preventDefault();
    props.onSubmit(
      props.singleStock.symbol,
      props.singleStock.quantity,
      props.user.cash,
      'sell',
      props.portfolio
    );
  };

  return (
    <StyledDivContainer>
      <Quote />
      <Quantity />

      <StyledButtonsContainer>
        <form onSubmit={handleBuy}>
          <StyledButton type="submit" name="buy" buttonColor="red">
            Buy
          </StyledButton>
        </form>

        <form onSubmit={handleSell}>
          <StyledButton type="submit" name="sell" buttonColor="green">
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
  onSubmit: (symbol, quantity, userCash, buySell, portfolio) =>
    dispatch(buyingSellingStock(symbol, quantity, userCash, buySell, portfolio))
});

export default connect(mapStateToProps, mapDispatchToProps)(BuySell);
