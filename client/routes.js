import { withRouter, Route, Switch } from 'react-router-dom'
import React, { Component } from 'react'
import Signup from './components/Signup'
import Signin from './components/Signin'
import MyAccount from './components/MyAccount'
import { gettingSessionUser } from './store/user-store'
import { connect } from 'react-redux'


class Routes extends Component {

  componentDidMount() {
    this.props.gettingSessionUser()
  }

  render() {
    return (
      <div>
        {this.props.user.id &&
          <Switch>
            <Route path='/' component={MyAccount} />
          </Switch>
        }
        {!this.props.user.id &&
          <Switch>
            <Route path='/Signup' component={Signup} />
            <Route path='/' component={Signin} />
          </Switch>
        }
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  gettingSessionUser: () => dispatch(gettingSessionUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)

