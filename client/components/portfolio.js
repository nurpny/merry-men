import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gettingPortfolio } from '../store/portfolio-store'
import styled from 'styled-components'
import { StyledTableContainer } from '../themes/StyledTableContainer'
import convertToUSD from '../../utils/convert-to-usd';
import Loading from './Loading'

const StyledPftContainer = styled(StyledTableContainer)`
  min-width: 300px;
  width: 400px;
`
export class Portfolio extends Component {

  componentDidMount() {
    this.props.onLoad(this.props.user.id);
  }

  render() {
    return (
      <StyledPftContainer>
        <h1>Portfolio</h1>
        {this.props.portfolio.length ?
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Market Value</th>
              </tr>
            </thead>
            <tbody>
              {this.props.portfolio.map(item =>
                <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td>{convertToUSD(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{convertToUSD(item.mv)}</td>
                </tr>
              )}
            </tbody>
        </table>
        : <Loading />}
      </StyledPftContainer >
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(gettingPortfolio())
})

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)


