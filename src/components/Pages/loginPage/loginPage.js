import React, { Component } from 'react';

import classes from './loginPage.module.css';
import Logo from '../../../assets/Logo/logo.png';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

class SignIn extends Component {
  state = {
    // Loadings
    pageLoading: true,
    logoLoaded: false,
    // Inputs
    email: '',
    password: '',
  };

  componentDidMount() {
    this.setState({ pageLoading: false });
  }

  ForgetHandler = () => {
    this.props.history.push('/recover');
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
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
      <div className={classes.Login}>
        <form
          className={classes.Form}
          onSubmit={(e) =>
            this.props.loginHandler(e, {
              email: this.state.email,
              password: this.state.password,
            })
          }
        >
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
          <br />
          <Input
            type='email'
            placeholder='Email'
            name='email'
            value={this.state.email}
            onChange={this.onChange}
          />
          <br />
          <Input
            type='password'
            placeholder='Password'
            name='password'
            onChange={this.onChange}
          />
          <br />
          <Button type='submit'>
            {this.props.isLoading ? '...' : 'Login'}
          </Button>
          <br />
          <div className={classes.Forget} onClick={this.ForgetHandler}>
            Forgot Password?
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default SignIn;
