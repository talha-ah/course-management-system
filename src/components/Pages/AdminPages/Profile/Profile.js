import React from 'react';

import classes from './Profile.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    pageLoading: true,
    isLoading: false,
    admin: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  };

  componentDidMount() {
    fetch('http://localhost:8080/admin/getadmin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        this.setState({
          firstName: resData.user.firstName,
          lastName: resData.user.lastName,
          email: resData.user.email,
          pageLoading: false
        });
      })
      .catch(err => {
        try {
          err.json().then(body => {
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
  }

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  onProfileUpdate = e => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: true });
    fetch('http://localhost:8080/admin/editadmin', {
      method: 'POST',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        this.props.notify(true, 'Success', resData.message);
        this.setState({ isLoading: false });
      })
      .catch(err => {
        try {
          err.json().then(body => {
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

  onPasswordUpdate = e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    if (this.state.newPassword === this.state.confirmPassword) {
      fetch('http://localhost:8080/admin/editadminpassword', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: this.state.password,
          newPassword: this.state.newPassword
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token
        }
      })
        .then(res => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then(resData => {
          this.setState({ isLoading: false });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch(err => {
          try {
            err.json().then(body => {
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
    } else {
      this.props.notify(true, 'Error', 'Passwords do not match.');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Profile}>
        <div className={classes.Title}>
          <h4>Your Profile</h4>
        </div>
        <form
          method='POST'
          className={classes.Form}
          onSubmit={this.onProfileUpdate}
        >
          <div className={classes.InputGroup}>
            <div className={classes.InputDiv}>
              <label htmlFor='firstName'>First Name</label>
              <Input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={this.state.firstName}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='lastName'>Last Name</label>
              <Input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={this.state.lastName}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='email'>Email Address</label>
            <Input
              type='email'
              name='email'
              placeholder='Email Address'
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='submit'>Update</Button>
          </div>
        </form>
        <br></br>
        <div className={classes.Title}>
          <h4>Change Password</h4>
        </div>
        <form
          method='POST'
          className={classes.Form}
          onSubmit={this.onPasswordUpdate}
        >
          <div className={classes.InputDiv}>
            <label htmlFor='password'>Current Password</label>
            <Input
              type='password'
              name='password'
              placeholder='Current Password'
              value={this.state.password}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='newPassword'>New Password</label>
            <Input
              type='password'
              name='newPassword'
              placeholder='New Password'
              value={this.state.newPassword}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <Input
              type='password'
              name='confirmPassword'
              placeholder='Current Password'
              value={this.state.confirmPassword}
              onChange={this.onChange}
            />
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default EditProfile;
