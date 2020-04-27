import React from 'react';

import classes from './Profile.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Tabs
    tab: 'info',
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
    // Password Inputs
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // CV Input
    file: null,
    fileName: '',
  };

  abortController = new AbortController();

  componentDidMount() {
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
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChange = (e) => {
    if (e.target.type === 'file' && e.target.files[0].name) {
      this.setState({
        file: e.target.files[0],
        fileName: e.target.files[0].name,
      });
    } else {
      const name = e.target.name;
      const value = e.target.value;
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

  onPasswordChange = (e) => {
    e.preventDefault();
    const currentPassword = this.state.currentPassword;
    const newPassword = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;

    if (
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== ''
    ) {
      if (newPassword === confirmPassword) {
        this.setState({ isLoading: true });
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/editteacherpassword`,
          {
            method: 'POST',
            body: JSON.stringify({
              currentPassword: currentPassword,
              newPassword: newPassword,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            signal: this.abortController.signal,
          }
        )
          .then((res) => {
            if (!res.ok) throw res;
            return res.json();
          })
          .then((resData) => {
            this.setState({
              tab: 'info',
              isLoading: false,
              password: '',
              newPassword: '',
              confirmPassword: '',
            });
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
        this.props.notify(
          true,
          'Error',
          'New and Confirm passwords do not match!'
        );
      }
    } else {
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  onCVSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    if (this.state.file !== null && this.state.fileName !== '') {
      const file = this.state.file;
      const fileName = this.state.fileName;
      const formData = new FormData();
      formData.append('image', file);
      formData.append('fileName', fileName);

      if (file.size < 5000000) {
        fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/editcv`, {
          method: 'POST',
          body: formData,
          headers: {
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
              tab: 'info',
              isLoading: false,
              file: null,
              fileName: '',
            });
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
        this.setState({ isLoading: false });
        this.props.notify(true, 'Error', 'File too big!');
      }
    } else {
      this.setState({ isLoading: false });
      this.props.notify(true, 'Error', 'No File attached!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Profile}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>Your Profile</strong>
          </span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'info' })}
            style={{
              borderBottom:
                this.state.tab === 'info' ? '1px solid #3b3e66' : '',
            }}
          >
            Change Personal Info
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'cv' })}
            style={{
              borderBottom:
                this.state.tab === 'cv' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Change CV
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'password' })}
            style={{
              borderBottom:
                this.state.tab === 'password' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Change Password
          </div>
        </div>
        {this.state.tab === 'info' ? (
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
                // value='1980-01-01'
                value={this.state.birthdate}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='phone'>Phone Number</label>
              <Input
                type='number'
                name='phone'
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
                onClick={() => this.props.history.push('/')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        ) : this.state.tab === 'cv' ? (
          <div>
            <div className={classes.cvUpload}>
              <form
                method='POST'
                // onSubmit={this.onCVSubmit}
                // encType='multipart/form-data'
              >
                <Input
                  type='file'
                  accept='application/pdf'
                  onChange={this.onChange}
                />
                <label htmlFor='file'>{this.state.fileName}</label>
                <p>Drag your file here or click to select file.</p>
              </form>
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
                onClick={this.onCVSubmit}
              >
                {this.state.isLoading
                  ? 'Uploading...'
                  : this.state.cv !== 'undefined'
                  ? 'Update CV'
                  : 'Submit CV'}
              </Button>
            </div>
          </div>
        ) : this.state.tab === 'password' ? (
          <form method='POST' onSubmit={this.onPasswordChange}>
            <div className={classes.InputDiv}>
              <label htmlFor='currentPassword'>Current Password</label>
              <Input
                type='password'
                name='currentPassword'
                placeholder='Current Password'
                value={this.state.currentPassword}
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
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        ) : (
          ''
        )}
      </div>
    );
    return page;
  }
}

export default EditProfile;
