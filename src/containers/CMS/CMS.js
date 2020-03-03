import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MainContent from '../../components/MainContent/MainContent';
import Login from '../../components/Pages/loginPage/loginPage';

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
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      this.setState({ pageLoading: false });
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
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('token', result.token);
        window.location.reload();
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

  logoutHandler = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.setState({
      isLoading: false,
      isAuth: false,
      token: '',
      userId: false,
      isAdmin: false
    });
  };

  render() {
    var route;
    if (this.state.pageLoading) {
      route = 'Loading...';
    } else {
      route = this.state.isAuth ? (
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
          <Redirect to='/' />
        </Switch>
      );
    }
    return route;
  }
}

export default CMS;
