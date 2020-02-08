import React from 'react';

import classes from './EditProfile.module.css';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    phone: '',
    address: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  };

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    console.log('Form submitted.');
    this.props.editingMode();
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
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='lastName'>Last Name</label>
                <Input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='email'>Email Address</label>
                <Input
                  type='email'
                  name='email'
                  placeholder='Email Address'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.props.editingMode}>Update</Button>
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
                  value='1980-01-01'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='phone'>Phone Number</label>
                <Input
                  type='number'
                  name='phone'
                  placeholder='Phone Number'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='address'>Address</label>
                <Input
                  type='text'
                  name='address'
                  placeholder='Address'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.props.editingMode}>Update</Button>
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
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='newPassword'>New Password</label>
                <Input
                  type='password'
                  name='newPassword'
                  placeholder='New Password'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <Input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.buttonDiv}>
                <Button onClick={this.props.editingMode}>Update</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
