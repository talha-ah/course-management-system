import React from 'react';

import classes from './EditProfile.module.css';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    isLoading: true,
    admin: '',
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    phone: '',
    address: ''
  };

  componentDidMount() {
    const adminId = '5e4cc4d495df8118f0583582';
    fetch(`http://localhost:8080/admin/getadmin/${adminId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Unknown Status Code');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          firstName: resData.admin.firstName,
          lastName: resData.admin.lastName,
          email: resData.admin.email,
          birthdate: resData.admin.dob,
          phone: resData.admin.phone,
          address: resData.admin.address
        });
        console.log(this.state.birthdate);
      })
      .catch(err => {
        console.log('AdminEditProfile', err);
      });
    console.log('Form submitted.');
  }

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    const formData = new FormData();

    formData.append('firstName', this.state.firstName);
    formData.append('lastName', this.state.lastName);
    formData.append('email', this.state.email);
    formData.append('dob', this.state.birthdate);
    formData.append('phone', this.state.phone);
    formData.append('address', this.state.address);

    const adminId = '5e4cc4d495df8118f0583582';
    fetch(`http://localhost:8080/admin/editadmin/${adminId}`)
      .then(res => {
        if (res.status !== 201) {
          throw new Error('Unknown Status Code');
        }
        return res.json();
      })
      .then(resData => {
        console.log('Admin Saved!', resData);
        this.props.history.goBack();
      })
      .catch(err => {
        console.log('AdminEditProfile', err);
      });
  };

  onChange = e => {
    console.log(e.target.name);
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className={classes.editProfile}>
        <div className={classes.editProfileHeader}>
          <h3>Profile Page</h3>
          <p>
            This is your profile page. You can see the progress you've made with
            your courses and manage your profile
          </p>
        </div>
        <div className={classes.editProfileArea}>
          <div className={classes.editProfileAreaDiv}>
            <div className={classes.editProfileArea1}>
              <div className={classes.editProfileAreaTitle}>
                <h4>Basic Information</h4>
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='firstName'>First Name</label>
                <Input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={this.state.firstName}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='lastName'>Last Name</label>
                <Input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={this.state.lastName}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='email'>Email Address</label>
                <Input
                  type='email'
                  name='email'
                  placeholder='Email Address'
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.onFormSubmit}>Update</Button>
              </div>
            </div>
            <div className={classes.editProfileArea2}>
              <div className={classes.editProfileAreaTitle}>
                <h4>Personal Information</h4>
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='birthdate'>Birthdate</label>
                <Input
                  type='date'
                  name='birthdate'
                  placeholder='Birthdate'
                  // value='1980-01-01'
                  // value={this.state.birthdate}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='phone'>Phone Number</label>
                <Input
                  type='number'
                  name='phone'
                  placeholder='Phone Number'
                  // value={this.state.phone}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='address'>Address</label>
                <Input
                  type='text'
                  name='address'
                  placeholder='Address'
                  value={this.state.address}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.onFormSubmit}>Update</Button>
              </div>
            </div>
            <div className={classes.editProfileArea3}>
              <div className={classes.editProfileAreaTitle}>
                <h4>Change Password</h4>
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='currentPassword'>Current Password</label>
                <Input
                  type='password'
                  name='currentPassword'
                  placeholder='Current Password'
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='newPassword'>New Password</label>
                <Input
                  type='password'
                  name='newPassword'
                  placeholder='New Password'
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <Input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.onFormSubmit}>Update</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
