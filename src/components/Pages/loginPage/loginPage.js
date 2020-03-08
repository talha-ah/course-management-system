import React, { Component } from 'react';

import classes from './loginPage.module.css';
import Logo from '../../../assets/Logo/logo.png';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  };

  ForgetHandler = () => {
    this.props.history.push('/recover');
  };

  onChange = e => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className={classes.Login}>
        <div className={classes.LeftLogin}>
          <form
            className={classes.Form}
            onSubmit={e =>
              this.props.loginHandler(e, {
                email: this.state.email,
                password: this.state.password
              })
            }
          >
            <img src={Logo} alt='DCS-LOGO' width='100px' />
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
              {this.props.isLoading ? 'Loading' : 'Login'}
            </Button>
            <br />
            <div className={classes.Forget} onClick={this.ForgetHandler}>
              Forgot Password?
            </div>
          </form>
        </div>
        <div className={classes.RightLogin}>
          <h1>Course Management System</h1>
        </div>
      </div>
    );
  }
}

export default SignIn;
