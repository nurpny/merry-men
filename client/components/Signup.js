import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signingUp } from '../store/user-store';
import { StyledFormContainer } from '../themes/StyledFormContainer';
import { StyledWarningDiv } from '../themes/StyledWarning';

export class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      validName: false,
      validEmail: false,
      validPassword: false,
      valid: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  async validateField(fieldName, value) {
    // validating fields
    // note the use of async await here to ensure that overall valid state is updated AFTER
    // validName/Email/Password is updated
    switch (fieldName) {
      case 'email':
        if (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          await this.setState({ validEmail: true });
        }
        break;
      case 'password':
        if (value.length >= 6 && value.match(/[A-Z]/i) && value.match(/\d/)) {
          await this.setState({ validPassword: true });
        }
        break;
      case 'name':
        if (value.length > 2) {
          await this.setState({ validName: true });
        }
        break;
      default:
        break;
    }
    await this.setState({
      valid:
        this.state.validEmail &&
        this.state.validPassword &&
        this.state.validName
    });
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    await this.props.signingUp(
      this.state.name,
      this.state.email,
      this.state.password,
      this.props.history
    );
  }

  async handleChange(evt) {
    // setState method takes a callback function as a second argument
    // note evt.target.name & value have to be assigned to constants to be called in the callback
    const name = evt.target.name;
    const value = evt.target.value;
    await this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  render() {
    return (
      <StyledFormContainer onSubmit={this.handleSubmit}>
        <h1>Sign up Form</h1>
        <div>
          <input
            name="name"
            placeholder="Name"
            type="text"
            onChange={this.handleChange}
            required="required"
          ></input>
        </div>
        <StyledWarningDiv>
          {!this.state.validName && 'Enter name'}
        </StyledWarningDiv>

        <div>
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={this.handleChange}
            required="required"
          ></input>
          <StyledWarningDiv>
            {!this.state.validEmail && 'Enter email'}
          </StyledWarningDiv>
        </div>

        <div>
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={this.handleChange}
            required="required"
          ></input>
        </div>
        <StyledWarningDiv>
          {!this.state.validPassword &&
            'Password must be at least 6 characters'}
        </StyledWarningDiv>
        <StyledWarningDiv>
          {!this.state.validPassword &&
            'and include a capital letter and a number'}
        </StyledWarningDiv>

        <button type="submit" disabled={!this.state.valid}>
          Create Your Account
        </button>
        <div>{this.props.error && this.props.error}</div>
      </StyledFormContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  error: state.error.signUp
});

const mapDispatchToProps = (dispatch) => ({
  signingUp: (name, email, password, history) =>
    dispatch(signingUp(name, email, password, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
