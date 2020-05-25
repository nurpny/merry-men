import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gettingPortfolio } from '../store/portfolio-store';
import styled from 'styled-components';
import { StyledTableContainer } from '../themes/StyledTableContainer';
import convertToUSD from '../../utils/convert-to-usd';

const StyledPftContainer = styled(StyledTableContainer)`
  min-width: 300px;
  width: 400px;
  h1 {
    margin-bottom: 0px;
  }
`;
const StyledSummary = styled.section`
  align-self: flex-end;
  padding-bottom: 5px;
  span {
    font-weight: bold;
  }
`;
const StyledSpan = styled.span`
  color: ${(props) => props.inputColor};
`;

export class Portfolio extends Component {
  chooseColor(pftItem) {
    if (pftItem.price > pftItem.openPrice) return 'green';
    else if (pftItem.price < pftItem.openPrice) return 'red';
    else return 'grey';
  }

  componentDidMount() {
    this.props.onLoad();
    // after the initial load, the prices will be refreshed every 5 min
    this.timer = setInterval(() => {
      this.props.onLoad();
    }, 300000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <StyledPftContainer>
        <h1>Portfolio</h1>
        <StyledSummary>
          Cash Available: <span>{convertToUSD(this.props.user.cash)}</span>
        </StyledSummary>
        <StyledSummary>
          Total Portfolio Value:{' '}
          <span>
            {convertToUSD(
              this.props.portfolio.reduce(
                (acc, pftItem) => acc + pftItem.mv,
                0
              ) + this.props.user.cash
            )}
          </span>
        </StyledSummary>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Market Value</th>
            </tr>
          </thead>
          {this.props.portfolio.length ? (
            <tbody>
              {this.props.portfolio.map((item) => (
                <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td>
                    <StyledSpan inputColor={this.chooseColor(item)}>
                      {convertToUSD(item.price)}
                    </StyledSpan>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{convertToUSD(item.mv)}</td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </StyledPftContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(gettingPortfolio())
});

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
