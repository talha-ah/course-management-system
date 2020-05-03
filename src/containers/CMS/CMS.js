import React, { Component, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';

import MainContent from '../../components/MainContent/MainContent';
import Spinner from '../../components/UI/Spinner/Spinner';
import Notify from '../../components/UI/Notify/Notify';
import PendingProfile from '../../components/Pages/TeacherPages/PendingProfile/PendingProfile';
const Login = React.lazy(() =>
  import('../../components/Pages/loginPage/loginPage')
);
const ForgetPassword = React.lazy(() =>
  import('../../components/Pages/loginPage/ForgetPassword/ForgetPassword')
);

class CMS extends Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Data
    status: 'Pending',
    isAuth: false,
    token: 'Pending',
    userId: false,
    isAdmin: false,
    notify: false,
    notifyType: '',
    notifyMessage: '',
  };

  abortController = new AbortController();

  componentWillUnmount() {
    this.abortController.abort();
  }

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
      this.setState({ pageLoading: false });
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/getprofilestatus`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.props.setUser(resData.user);
        var isAdmin = false;
        const check = token.split(' ')[1];
        if (check === 'yes') {
          isAdmin = true;
        }
        this.setState({
          isAuth: true,
          status: resData.teacher.status,
          token: token,
          userId: userId,
          isAdmin: isAdmin,
          pageLoading: false,
        });
        const remainingMilliseconds =
          new Date(expiry).getTime() - new Date().getTime();
        this.autoLogoutHandler(remainingMilliseconds);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
          try {
            err.json().then((body) => {
              this.transitNotify(
                true,
                'Error',
                body.error.status + ' ' + body.message
              );
            });
          } catch (e) {
            this.transitNotify(
              true,
              'Error',
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  }

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      }),
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.props.setUser(resData.user);
        var isAdmin = false;
        const check = resData.token.split(' ')[1];
        if (check === 'yes') {
          isAdmin = true;
        }
        this.setState({
          isAuth: true,
          status: resData.user.status,
          token: resData.token,
          userId: resData.userId,
          isAdmin: isAdmin,
          isLoading: false,
        });
        this.transitNotify(true, 'Success', resData.message);
        localStorage.setItem('userId', resData.userId);
        localStorage.setItem('token', resData.token);
        const expiry = 3600000;
        const expiryDate = new Date(new Date().getTime() + expiry);
        localStorage.setItem('expiry', expiryDate.toISOString());
        this.autoLogoutHandler(expiry);
        // window.location.reload();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        if (error.name === 'AbortError') {
        } else {
          try {
            error.json().then((body) => {
              this.transitNotify(
                true,
                'Error',
                body.error.status + ' ' + body.message
              );
            });
          } catch (e) {
            this.transitNotify(
              true,
              'Error',
              error.message +
                ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  };

  defaultNotify = () => {
    setTimeout(() => {
      this.setState({
        notify: false,
        notifyType: '',
        notifyMessage: '',
      });
    }, 3000);
  };

  transitNotify = (notify, notifyType, notifyMessage) => {
    this.setState({
      notify: notify,
      notifyType: notifyType,
      notifyMessage: notifyMessage,
    });
    this.defaultNotify();
  };

  autoLogoutHandler = (expiry) => {
    setTimeout(() => {
      this.logoutHandler();
      // this.transitNotify(true, 'Success', 'AutoLogout was successfull.');
    }, expiry);
  };

  logoutHandler = () => {
    this.setState({
      isLoading: false,
      isAuth: false,
      token: '',
      userId: false,
      isAdmin: false,
    });
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    this.props.resetSidebar();
    this.transitNotify(true, 'Success', 'Logout successfully.');
  };

  changeStatus = (status) => {
    this.setState({
      status: status,
    });
  };

  render() {
    var route = this.state.pageLoading ? (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner size='Big' />
      </div>
    ) : this.state.isAuth ? (
      this.state.status === 'Pending' && !this.state.isAdmin ? (
        <PendingProfile
          isAdmin={this.state.isAdmin}
          token={this.state.token}
          userId={this.state.userId}
          notify={this.transitNotify}
          logoutHandler={this.logoutHandler}
          changeStatus={this.changeStatus}
        />
      ) : (
        <MainContent
          authData={{
            isAdmin: this.state.isAdmin,
            token: this.state.token,
            userId: this.state.userId,
            notify: this.transitNotify,
          }}
          logoutHandler={this.logoutHandler}
        />
      )
    ) : (
      <Suspense
        fallback={
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner size='Big' />
          </div>
        }
      >
        <Switch>
          <Route
            path='/'
            exact
            render={(props) => (
              <Login
                {...props}
                loginHandler={this.loginHandler}
                isLoading={this.state.isLoading}
                notify={this.transitNotify}
              />
            )}
          />
          <Route
            path='/recover'
            exact
            render={(props) => (
              <ForgetPassword
                {...props}
                isLoading={this.state.isLoading}
                notify={this.transitNotify}
              />
            )}
          />
          <Redirect to='/' />
        </Switch>
      </Suspense>
    );
    return (
      <>
        {this.state.notify ? (
          <Notify
            notify
            type={this.state.notifyType}
            message={this.state.notifyMessage}
          />
        ) : (
          ''
        )}
        {route}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetSidebar: () => dispatch({ type: actionTypes.RESET_SIDEBAR }),
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, user: user }),
  };
};

export default connect(null, mapDispatchToProps)(CMS);
