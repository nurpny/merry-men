import React, { useReducer, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { StyledFormContainer } from '../themes/StyledFormContainer'
import { buyingSellingStock } from '../store/transaction-store'

const StyledBuySellContainer = styled(StyledFormContainer)`
  .buttons {
    display: flex;
  }

  .buy {
    color: ${props => props.theme.colors.green};
    border-color: ${props => props.theme.colors.green};
  }

  .sell {
    color: ${props => props.theme.colors.red};
    border-color: ${props => props.theme.colors.red};
  }
`

export const BuySell = (props) => {
  const [userInput, setUserInput] = useReducer((state, newState) => ({
    ...state, ...newState
  }), { ticker: "", qty: 0 })

  // buyOrSell states determined by which button the user presses
  const [buyOrSell, setBuyOrSell] = useState("")

  const handleSubmit = (evt) => {
    evt.preventDefault()
    props.onSubmit(userInput.ticker, userInput.qty, props.user.id, props.user.cash, buyOrSell, props.portfolio)
  }

  const handleChange = (evt) => {
    setUserInput({ [evt.target.name]: evt.target.value })
  }

  const handleClick = (evt) => {
    setBuyOrSell(evt.target.name)
  }

  return (
    <StyledBuySellContainer onSubmit={handleSubmit}>
      <div> <input name="ticker" placeholder="Ticker" type="text" onChange={handleChange} required='required'></input> </div>
      <div> <input name="qty" placeholder="Quantity" type="number" onChange={handleChange} required='required' min="1" step="1"></input> </div>
      <div className="buttons">
        <button type="submit" name="sell" className="sell" onClick={handleClick}>Sell</button>
        <button type="submit" name="buy" className="buy" onClick={handleClick}>Buy</button>
      </div>
      <div>{props.error.buySell && props.error.buySell}</div>
    </StyledBuySellContainer>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  portfolio: state.portfolio,
  error: state.error
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (symbol, quantity, userId, userCash, buySell, portfolio) => dispatch(buyingSellingStock(symbol, quantity, userId, userCash, buySell, portfolio))
})

export default connect(mapStateToProps, mapDispatchToProps)(BuySell)
