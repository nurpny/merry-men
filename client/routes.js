import { withRouter, Route, Switch } from 'react-router-dom'
import React from 'react'
import Signup from './components/signup'
import Signin from './components/signin'
import MyAccount from './components/my-account'



export default function routes() {
  return (
    <Switch>
      <Route path='/account' component={MyAccount} />
      <Route path='/' component={Signin} />
    </Switch>
  )
}
