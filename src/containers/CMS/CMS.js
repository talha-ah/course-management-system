import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MainContent from '../../components/MainContent/MainContent';
import Login from '../../components/Pages/loginPage/loginPage';
import ForgetPassword from '../../components/Pages/loginPage/ForgetPassword/ForgetPassword';
import Spinner from '../../components/UI/Spinner/Spinner';

import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';

class CMS extends Component {
  state = {
    isLoading: false,
    pageLoading: true,
    isAuth: false,
    token: '',
    userId: false,
    isAdmin: false
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    const userId = localStorage.getItem('userId');
    if (!token || !userId || !expiry) {
      this.setState({ pageLoading: false });
      return;
    }
    if (new Date(expiry) <= new Date()) {
      this.logoutHandler();
      return;
    }

    var isAdmin = false;
    const check = token.split(' ')[1];
    if (check === 'yes') {
      isAdmin = true;
    }
    this.setState({
      isAuth: true,
      token: token,
      userId: userId,
      isAdmin: isAdmin,
      pageLoading: false
    });
    const remainingMilliseconds =
      new Date(expiry).getTime() - new Date().getTime();
    this.autoLogoutHandler(remainingMilliseconds);
  }

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(result => {
        var isAdmin = false;
        const check = result.token.split(' ')[1];
        if (check === 'yes') {
          isAdmin = true;
        }
        this.setState({
          isAuth: true,
          token: result.token,
          userId: result.userId,
          isAdmin: isAdmin,
          isLoading: false
        });
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('token', result.token);
        const expiry = 3600000;
        const expiryDate = new Date(new Date().getTime() + expiry);
        localStorage.setItem('expiry', expiryDate.toISOString());
        this.autoLogoutHandler(expiry);
        // window.location.reload();
      })
      .catch(error => {
        this.setState({ isLoading: false });
        try {
          error.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(error);
        }
      });
  };

  autoLogoutHandler = expiry => {
    setTimeout(() => {
      this.logoutHandler();
    }, expiry);
  };

  logoutHandler = () => {
    this.setState({
      isLoading: false,
      isAuth: false,
      token: '',
      userId: false,
      isAdmin: false
    });
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
  };

  render() {
    var route = this.state.pageLoading ? (
      <Spinner />
    ) : this.state.isAuth ? (
      <MainContent
        authData={{
          isAdmin: this.state.isAdmin,
          token: this.state.token,
          userId: this.state.userId
        }}
        logoutHandler={this.logoutHandler}
      />
    ) : (
      <Switch>
        <Route
          path='/'
          exact
          render={props => (
            <Login
              {...props}
              loginHandler={this.loginHandler}
              isLoading={this.state.isLoading}
            />
          )}
        />
        <Route
          path='/recover'
          exact
          render={props => (
            <ForgetPassword {...props} isLoading={this.state.isLoading} />
          )}
        />
        <Redirect to='/' />
      </Switch>
    );
    return <ErrorBoundary>{route}</ErrorBoundary>;
  }
}

export default CMS;
