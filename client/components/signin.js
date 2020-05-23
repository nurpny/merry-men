import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import { loggingIn } from '../store/user-store'
import { StyledFormContainer } from '../themes/StyledFormContainer'
import { Link } from 'react-router-dom'

export const signin = (props) => {
  const [userInput, setUserInput] = useReducer((state, newState) => ({
    ...state, ...newState
  }), { email: "", password: "" })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    props.loggingIn(userInput.email, userInput.password)
  }

  const handleChange = (evt) => {
    setUserInput({ [evt.target.name]: evt.target.value })
  }

  return (
    <StyledFormContainer onSubmit={handleSubmit}>
      <h1>Sign In </h1>
      <div>  <input name="email" placeholder="Email" type="email" onChange={handleChange} required='required'></input> </div>
      <div> <input name="password" placeholder="Password" type="password" onChange={handleChange} required='required'></input> </div>
      <button type="submit">Sign In</button>
      {props.error && <div>Incorrect email and/or password</div>}
      <div>If you have not signed up for our services yet, click <Link to='/signup'>here</Link> to sign up.</div>
    </StyledFormContainer >
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  error: state.error.login
})

const mapDispatchToProps = (dispatch) => ({
  loggingIn: (email, password) => dispatch(loggingIn(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(signin)
