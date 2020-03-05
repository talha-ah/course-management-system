import React from 'react';

import classes from './Profile.module.css';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

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
          birthdate: resData.user.dob,
          phone: resData.user.phone,
          address: resData.user.address,
          isLoading: false
        });
      })
      .catch(err => {
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
      });
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

    fetch('http://localhost:8080/admin/editadmin')
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        console.log('Admin Saved!', resData);
        this.props.history.goBack();
      })
      .catch(err => {
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
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
    const page = this.state.isLoading ? (
      'Loading ...'
    ) : (
      <div className={classes.Profile}>
        <div className={classes.Title}>
          <h4>Your Profile</h4>
        </div>
        <form className={classes.Form} onSubmit={this.onFormSubmit}>
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
              // value={this.state.birthdate}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='phone'>Phone Number</label>
            <Input
              type='number'
              name='phone'
              placeholder='Phone Number'
              // value={this.state.phone}
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
              <label htmlFor='address'>Country</label>
              <Input
                type='text'
                name='address'
                placeholder='Address'
                value={this.state.address}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='address'>City</label>
              <Input
                type='text'
                name='address'
                placeholder='Address'
                value={this.state.address}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='address'>Zip</label>
              <Input
                type='text'
                name='address'
                placeholder='Address'
                value={this.state.address}
                onChange={this.onChange}
              />
            </div>
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='submit'>Update</Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default EditProfile;
