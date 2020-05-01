import React, { Component } from 'react';

import classes from './loginPage.module.css';
import Logo from '../../../assets/Logo/logo.png';
import Background from '../../../assets/background.jpg';
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

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  ForgetHandler = () => {
    this.props.history.push('/recover');
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
        className={classes.Login}
      >
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
          <div className={classes.InputDiv}>
            <label htmlFor='email'>Email</label>
            <Input
              type='email'
              placeholder='Email'
              name='email'
              value={this.state.email}
              onChange={this.onChange}
              autoComplete='username'
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='password'>Password</label>
            <Input
              type='password'
              placeholder='Password'
              name='password'
              onChange={this.onChange}
              autoComplete='current-password'
            />
          </div>
          <div className={classes.ButtonDiv}>
            <Button type='submit' disabled={this.props.isLoading}>
              {this.props.isLoading ? '...' : 'Login'}
            </Button>
          </div>
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
