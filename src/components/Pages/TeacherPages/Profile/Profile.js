import React from 'react';

import classes from './Profile.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    pageLoading: true,
    isLoading: false,
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    zip: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    file: null,
    fileName: ''
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/getteacher`, {
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
          pageLoading: false,
          firstName: resData.teacher.firstName,
          lastName: resData.teacher.lastName,
          email: resData.teacher.email,
          birthdate: resData.teacher.dob,
          phone: resData.teacher.phone,
          address: resData.teacher.address.address,
          country: resData.teacher.address.country,
          city: resData.teacher.address.city,
          zip: resData.teacher.address.zip
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
    if (e.target.type === 'file' && e.target.files[0].name) {
      this.setState({
        file: e.target.files[0],
        fileName: e.target.files[0].name
      });
    } else {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({
        [name]: value
      });
    }
  };

  onProfileUpdate = e => {
    e.preventDefault();

    this.setState({ isLoading: true });
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/editteacher`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        dob: this.state.birthdate,
        phone: this.state.phone,
        address: this.state.address,
        country: this.state.country,
        city: this.state.city,
        zip: this.state.zip
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
  };

  onPasswordChange = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (this.state.newPassword === this.state.confirmPassword) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/editteacherpassword`, {
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
      this.props.notify(true, 'Error', 'Passwords do not match!');
    }
  };

  onCVSubmit = e => {
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
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          });
      } else {
        this.props.notify(true, 'Error', 'File too big!');
      }
    } else {
      this.props.notify(true, 'Error', 'No File attached!');
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
            <Button type='submit'>
              {this.state.isLoading ? 'Loading...' : 'Update Profile'}
            </Button>
          </div>
        </form>
        <br></br>
        <div className={classes.Title}>
          <h4>Change Password</h4>
        </div>
        <form
          method='POST'
          className={classes.Form}
          onSubmit={this.onPasswordChange}
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
        <br></br>
        <div className={classes.Title}>
          <h4>Update CV</h4>
        </div>

        <div className={classes.cvUpload}>
          <form
            method='POST'
            onSubmit={this.onCVSubmit}
            // encType='multipart/form-data'
          >
            <Input type='file' onChange={this.onChange} />
            <label htmlFor='file'>{this.state.fileName}</label>
            <p>Drag your file here or click to select file.</p>
            <div className={classes.ButtonDiv}>
              <Button type='submit'>
                {this.state.isLoading ? 'Loading...' : 'Update CV'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
    return page;
  }
}

export default EditProfile;
