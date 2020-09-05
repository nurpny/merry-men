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
      validName: true,
      validEmail: true,
      validPassword: true,
      valid: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  async validateField() {
    // validating fields
    // note the use of async await here to ensure that overall valid state is updated AFTER
    // validName/Email/Password is updated
    if (this.state.name.length <= 2) {
      await this.setState({ validName: false });
    } else {
      await this.setState({ validName: true });
    }
    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      await this.setState({ validEmail: false });
    } else {
      await this.setState({ validEmail: true });
    }
    if (
      this.state.password.length < 6 ||
      !this.state.password.match(/[A-Z]/i) ||
      !this.state.password.match(/\d/)
    ) {
      await this.setState({ validPassword: false });
    } else {
      await this.setState({ validPassword: true });
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
    await this.validateField();
    if (this.state.valid) {
      await this.props.signingUp(
        this.state.name,
        this.state.email,
        this.state.password,
        this.props.history
      );
    }
  }

  async handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    await this.setState({ [name]: value });
  }

  render() {
    return (
      <StyledFormContainer onSubmit={this.handleSubmit}>
        <h1>Sign up Form</h1>
        <input
          name="name"
          placeholder="Name"
          type="text"
          onChange={this.handleChange}
          required="required"
        ></input>

        <StyledWarningDiv>
          {!this.state.validName && 'Enter a valid name'}
        </StyledWarningDiv>
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={this.handleChange}
          required="required"
        ></input>
        <StyledWarningDiv>
          {!this.state.validEmail && 'Enter a valid email'}
        </StyledWarningDiv>
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={this.handleChange}
          required="required"
        ></input>

        <StyledWarningDiv>
          {!this.state.validPassword &&
            'Password must be at least 6 characters and include a capital letter and a number'}
        </StyledWarningDiv>

        <button type="submit">Create Your Account</button>
        {this.props.error && this.props.error}
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
