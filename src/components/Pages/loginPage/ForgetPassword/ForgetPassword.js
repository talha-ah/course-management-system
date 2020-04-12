import React, { Component } from 'react';

import classes from './ForgetPassword.module.css';
import Logo from '../../../../assets/Logo/logo.png';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';

class SignIn extends Component {
  state = {
    email: '',
  };

  onChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  onFormSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/login/forgetpassword`, {
      method: 'POST',
      body: JSON.stringify({ email: this.state.email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.props.history.push('/');
      })
      .catch((err) => {
        try {
          err.json().then((body) => {
            this.props.notify(
              true,
              'Error',
              body.error.status + ' ' + body.message
            );
          });
        } catch (e) {
          this.props.notify(
            true,
            'Error',
            err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
          );
        }
      });
  };

  onLoginHandler = () => {
    this.props.history.push('/');
  };

  render() {
    return (
      <div className={classes.Forget}>
        <form className={classes.Form} onSubmit={this.onFormSubmit}>
          <img src={Logo} alt='DCS-LOGO' width='100px' />
          <br />
          <p>Enter your email to get password.</p>
          <br />
          <Input
            type='email'
            placeholder='Email'
            name='email'
            value={this.state.email}
            onChange={this.onChange}
          />
          <br />
          <Button type='submit'>
            {this.props.isLoading ? 'Sending...' : 'Send'}
          </Button>
          <br />
          <div onClick={this.onLoginHandler} className={classes.LogIn}>
            Log In
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;
