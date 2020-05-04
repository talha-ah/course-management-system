import React from 'react';

import classes from './PendingProfile.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class PendingProfile extends React.Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Personal Info
    firstName: '',
    lastName: '',
    currentEmail: '',
    birthdate: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    zip: '',
    cv: '',
  };

  abortController = new AbortController();

  componentDidMount() {
    this.fetchTeacher();
  }

  fetchTeacher = () => {
    this.setState({ pageLoading: true });
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/getteacher`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.setState({
          pageLoading: false,
          firstName: resData.teacher.firstName,
          lastName: resData.teacher.lastName,
          currentEmail: resData.teacher.email,
          birthdate: resData.teacher.dob,
          phone: resData.teacher.phone,
          address: resData.teacher.address.address,
          country: resData.teacher.address.country,
          city: resData.teacher.address.city,
          zip: resData.teacher.address.zip,
          cv: resData.teacher.cvUrl,
        });
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

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'phone') {
      if (value.length > 14) {
        this.setState((prevState) => ({
          phone: prevState.phone,
        }));
      } else {
        this.setState({
          phone: value,
        });
      }
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  onProfileUpdate = (e) => {
    e.preventDefault();
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const email = this.state.currentEmail;
    const dob = this.state.birthdate;
    const phone = this.state.phone;
    const address = this.state.address;
    const country = this.state.country;
    const city = this.state.city;
    const zip = this.state.zip;

    if (
      firstName !== '' &&
      firstName &&
      lastName !== '' &&
      lastName &&
      email !== '' &&
      email &&
      dob !== '' &&
      dob &&
      phone !== '' &&
      phone &&
      address !== '' &&
      address &&
      country !== '' &&
      country &&
      city !== '' &&
      city &&
      zip !== '' &&
      zip
    ) {
      this.setState({ isLoading: true });
      fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/editteacher`, {
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          dob: dob,
          phone: phone,
          address: address,
          country: country,
          city: city,
          zip: zip,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token,
        },
        signal: this.abortController.signal,
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({ isLoading: false });
          this.props.changeStatus('Active');
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
          } else {
            this.setState({ isLoading: false });
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
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          }
        });
    } else {
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.PendingProfileDiv}>
        <div className={classes.PendingProfile}>
          <div className={classes.Caption}>
            <span className={classes.CaptionSpan}>
              <strong>Set Up Your Profile First!</strong>
            </span>
          </div>
          <form method='POST' onSubmit={this.onProfileUpdate}>
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
              <label htmlFor='currentEmail'>Email Address</label>
              <Input
                type='email'
                name='currentEmail'
                placeholder='Email Address'
                value={this.state.currentEmail}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='birthdate'>Birthdate</label>
              <Input
                type='date'
                name='birthdate'
                placeholder='Birthdate'
                value={
                  this.state.birthdate ? this.state.birthdate : '1990-01-01'
                }
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='phone'>Phone Number</label>
              <Input
                type='number'
                name='phone'
                defaultValue='03'
                placeholder='Phone Number'
                value={this.state.phone}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='address'>Address</label>
              <Input
                type='text'
                name='address'
                placeholder='Address'
                value={this.state.address}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputGroup}>
              <div className={classes.InputDiv}>
                <label htmlFor='country'>Country</label>
                <Input
                  type='text'
                  name='country'
                  placeholder='Country'
                  value={this.state.country}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.InputDiv}>
                <label htmlFor='city'>City</label>
                <Input
                  type='text'
                  name='city'
                  placeholder='City'
                  value={this.state.city}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.InputDiv}>
                <label htmlFor='zip'>Zip</label>
                <Input
                  type='text'
                  name='zip'
                  placeholder='Zip'
                  value={this.state.zip}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                buttonType='red'
                onClick={this.props.logoutHandler}
              >
                Logout
              </Button>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
    return page;
  }
}

export default PendingProfile;
