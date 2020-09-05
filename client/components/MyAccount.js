import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Transactions from './Transactions';
import Portfolio from './Portfolio';
import BuySell from './BuySell';
import { loggingOut } from '../store/user-store.js';

const StyledScreenContainer = styled.section`
  margin: 10px 20px;
`;
const StyledMenuContainer = styled.section`
  display: flex;
  justify-content: flex-end;
`;
const StyledMenu = styled.section`
  color: ${(props) => props.theme.colors.blue};
  cursor: pointer;
  margin: 20px 10px;
`;

const StyledMenuBorder = styled.section`
  color: ${(props) => props.theme.colors.blue};
  margin: 20px 10px;
`;

const PortfolioContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

export const MyAccount = (props) => {
  const [showTransactions, setShowTransactions] = useState(false);

  return (
    <StyledScreenContainer>
      <h1>Merry Men</h1>
      <StyledMenuContainer>
        <StyledMenu onClick={() => setShowTransactions(false)}>
          Portfolio
        </StyledMenu>
        <StyledMenuBorder> | </StyledMenuBorder>
        <StyledMenu onClick={() => setShowTransactions(true)}>
          Transactions
        </StyledMenu>
        <StyledMenuBorder> | </StyledMenuBorder>
        <StyledMenu onClick={props.loggingOut}>Logout</StyledMenu>
      </StyledMenuContainer>
      <div>Welcome, {props.user.name}!</div>
      {!showTransactions && (
        <PortfolioContainer>
          <Portfolio />
          <BuySell />
        </PortfolioContainer>
      )}
      {showTransactions && <Transactions />}
    </StyledScreenContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  loggingOut: () => dispatch(loggingOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
