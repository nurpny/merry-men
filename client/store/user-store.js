import axios from 'axios'
import { LOGIN_ERROR, SIGNUP_ERROR } from './error-store'


// Action Types
export const GET_USER = 'GET_USER'
export const REMOVE_USER = 'REMOVE_USER'


// Initial State
const defaultUser = {}


// Action Creators
export const getUser = user => ({
  type: GET_USER,
  user: user,
  loginError: null,  //clear any login/signup error previously triggered
  signUpError: null
})

export const removeUser = () => ({
  type: REMOVE_USER
})

const loginError = errMsg => ({
  type: LOGIN_ERROR,
  loginError: errMsg
})

const signUpError = errMsg => ({
  type: SIGNUP_ERROR,
  signUpError: errMsg
})

// Thunk Creators
export const gettingSessionUser = () => async dispatch => {
  try {
    const res = await axios.get('/auth/sessionUser')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const loggingIn = (email, password) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/login`, {email, password})
  } catch (authError) {
    return dispatch(loginError(authError.response.data))
  }
  try {
    dispatch(getUser(res.data))
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const signingUp = (name, email, password) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/signup`, {name, email, password})
  } catch (authError) {
    return dispatch(signUpError(authError.response.data))
  }
  try {
    dispatch(getUser(res.data))
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const loggingOut = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
  } catch (err) {
    console.error(err)
  }
}


// Reducer
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
