import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { StyledFormContainer } from '../themes/StyledFormContainer'
import { } from '../store/transaction-store'

const StyledBuySellContainer = styled(StyledFormContainer)`

`

export const BuySell = (props) => {
  const [userInput, setUserInput] = useReducer((state, newState) => ({
    ...state, ...newState
  }), { ticker: "", qty: 0 })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    props.loggingIn(userInput.ticker, userInput.qty)
  }

  const handleChange = (evt) => {
    setUserInput({ [evt.target.name]: evt.target.value })
  }

  return (
    <StyledBuySellContainer>
      <div>  <input name="ticker" placeholder="Ticker" type="text" onChange={handleChange} required='required'></input> </div>
      <div> <input name="qty" placeholder="Quantity" type="number" onChange={handleChange} required='required'></input> </div>
      <button type="submit">Buy</button>
      <button type="submit">Sell</button>
    </StyledBuySellContainer>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BuySell)
