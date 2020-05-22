import React, { useState } from 'react'
import { connect } from 'react-redux'
import Transactions from './Transactions'
import Portfolio from './portfolio'
import styled from 'styled-components'
import { loggingOut } from '../store/user-store.js'


const StyledMenuContainer = styled.section`
  display: flex;
  justify-content: flex-end;
`
const StyledMenu = styled.section`
  color: ${props => props.theme.colors.blue};
  cursor: pointer;
  margin: 20px 10px;
`

const StyledMenuBorder = styled.section`
  color: ${props => props.theme.colors.blue};
  margin: 20px 10px;
`

export const MyAccount = (props) => {
  const [showTransactions, setShowTransactions] = useState(false);


  return (
    <div>
      <StyledMenuContainer>
        <StyledMenu onClick={() => setShowTransactions(false)}>Portfolio</StyledMenu>
        <StyledMenuBorder> | </StyledMenuBorder>
        <StyledMenu onClick={() => setShowTransactions(true)}>Transactions</StyledMenu>
        <StyledMenuBorder> | </StyledMenuBorder>
        <StyledMenu onClick={props.loggingOut}>Logout</StyledMenu>
      </StyledMenuContainer>

      {!showTransactions && <Portfolio/>}
      {showTransactions && <Transactions/>}

    </div>
  )
}


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
  loggingOut: () => (dispatch(loggingOut()))
})


export default connect(mapStateToProps, mapDispatchToProps)(MyAccount)
