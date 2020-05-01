import React, { Component } from 'react';

import classes from './ForgetPassword.module.css';
import Logo from '../../../../assets/Logo/logo.png';
import Background from '../../../../assets/background.jpg';
import Spinner from '../../../UI/Spinner/Spinner';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';

class ForgetPassword extends Component {
  state = {
    // Loadings
    pageLoading: true,
    logoLoaded: false,
    // Inputs
    email: '',
  };

  abortController = new AbortController();

  componentWillUnmount() {
    this.abortController.abort();
  }

  componentDidMount() {
    this.setState({ pageLoading: false });
  }

  onChange = (e) => {
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
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.props.history.push('/');
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
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
        }
      });
  };

  onLoginHandler = () => {
    this.props.history.replace('/');
  };

  render() {
    const logoStyle = {
      display: 'block',
      height: '100%',
      margin: 'auto',
    };
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div
        style={{
          backgroundImage: `url(${Background})`,
          backgroundColor: '#ccc',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className={classes.ForgetPassword}
      >
        <form className={classes.Form} onSubmit={this.onFormSubmit}>
          <div
            style={{ width: '6.25rem', height: '7.05rem', textAlign: 'center' }}
          >
            {this.state.logoLoaded ? '' : <Spinner />}
            <img
              src={Logo}
              alt='DCS-LOGO'
              style={this.state.logoLoaded ? logoStyle : { display: 'none' }}
              onLoad={() => this.setState({ logoLoaded: true })}
            />
          </div>
          <div className={classes.InputDiv}>
            <label>
              To reset your password, <br />
              Please enter your email here.
            </label>
            <br />
            <label htmlFor='email'>Email</label>
            <Input
              type='email'
              placeholder='Email'
              name='email'
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.ButtonDiv}>
            <Button type='submit' disabled={this.props.isLoading}>
              {this.props.isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </div>
          <div className={classes.Login} onClick={this.onLoginHandler}>
            Sign In
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default ForgetPassword;
