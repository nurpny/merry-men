import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gettingPortfolio } from '../store/portfolio-store'
import styled from 'styled-components'
import { StyledTableContainer } from '../themes/StyledTableContainer'

export class Portfolio extends Component {

  componentDidMount() {
    this.props.onLoad(this.props.user.id);
  }

  render() {
    return (
      <StyledTableContainer>
        <h1>Portfolio</h1>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Market Value</th>
            </tr>
          </thead>
          {this.props.portfolio.length ?
            <tbody>
              {this.props.portfolio.map(item =>
                <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.mv}</td>
                </tr>
              )}
            </tbody> : null}

        </table>
      </StyledTableContainer >
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (userId) => dispatch(gettingPortfolio(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)


