import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gettingTransactions } from '../store/transaction-store';
import { StyledTableContainer } from '../themes/StyledTableContainer';
import getDateOnly from '../../utils/get-date-only';
import convertToUSD from '../../utils/convert-to-usd';

export class transactions extends Component {
  componentDidMount() {
    this.props.onLoad(this.props.user.id);
  }
  render() {
    return (
      <StyledTableContainer>
        <h2>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Net Cash</th>
            </tr>
          </thead>
          {this.props.transactions.length ? (
            <tbody>
              {this.props.transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{getDateOnly(txn.createdAt)}</td>
                  <td>{txn.id}</td>
                  <td>{txn.symbol}</td>
                  <td>{convertToUSD(txn.price)}</td>
                  <td>{txn.quantity}</td>
                  <td>{convertToUSD(-txn.quantity * txn.price)}</td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </StyledTableContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(gettingTransactions())
});

export default connect(mapStateToProps, mapDispatchToProps)(transactions);
