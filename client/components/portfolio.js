import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gettingPortfolio } from '../store/portfolio-store'
import styled from 'styled-components'


const StyledTableContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin: 20px;

  h1 {
    color: ${props => props.theme.colors.blue};
  }

  table {
    border-collapse: separate;
    th {
      border-left: 1px solid ${props => props.theme.colors.lightgrey};
      border-bottom: 1px solid ${props => props.theme.colors.lightgrey};
      border-top: 1px solid ${props => props.theme.colors.lightgrey};
    }
    td {
      border-bottom: 1px solid ${props => props.theme.colors.lightgrey};
      text-align: center;
    }
    th: first-child {
      border-left: none;
    }
  }
`



export class portfolio extends Component {

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
          <tbody>
            {this.props.portfolio.length &&
              this.props.portfolio.map(item =>
                <tr key={item.id}>
                  <td>{item.symbol}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.mv}</td>
                </tr>)}
          </tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(portfolio)


