import React from 'react';

import classes from './EditProfile.module.css';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';

class EditProfile extends React.Component {
  state = {
    isLoading: true,
    file: null,
    fileName: '',
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

  componentDidMount() {
    const teacherId = '5e4cc7a4781ba62684fe3892';
    fetch(`http://localhost:8080/teacher/getteacher/${teacherId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Unable to fetch the teacher');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          isLoading: false,
          firstName: resData.teacher.firstName,
          lastName: resData.teacher.lastName,
          email: resData.teacher.email,
          birthdate: resData.teacher.dob,
          phone: resData.teacher.phone,
          address: resData.teacher.address
        });
      })
      .catch(err => {
        console.log('EditProfile', err);
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

  onFormSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const formData = new FormData();
    formData.append('firstName', this.state.firstName);
    formData.append('lastName', this.state.lastName);
    formData.append('email', this.state.email);
    formData.append('dob', this.state.birthdate);
    formData.append('phone', this.state.phone);
    formData.append('address', this.state.address);

    const teacherId = '5e4cc7a4781ba62684fe3892';
    fetch(`http://localhost:8080/teacher/editteacher/${teacherId}`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        this.setState({ isLoading: false });
        console.log('Profile Updated Successfully!');
        console.log(resData);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log('EditPageError', err);
      });
  };

  onCVSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: false });

    if (this.state.file !== null && this.state.fileName !== '') {
      const file = this.state.file;
      const fileName = this.state.fileName;
      const formData = new FormData();
      formData.append('image', file);
      formData.append('fileName', fileName);

      if (file.size < 5000000) {
        const teacherId = '5e4cc7a4781ba62684fe3892';
        fetch(`http://localhost:8080/teacher/editcv/${teacherId}`, {
          method: 'POST',
          body: formData
        })
          .then(res => {
            // if (res.status !== 200 || res.status !== 201) {
            //   var error = new Error(res.json());
            //   error.status = 500;
            //   throw error;
            // }
            return res.json();
          })
          .then(resData => {
            console.log('CV Submitted.');
            console.log(resData);
          })
          .catch(err => {
            console.log('onCVSubmitError', err);
          });
      } else {
        console.log('File too big!');
      }
    } else {
      console.log('No File attached');
    }
  };

  render() {
    const page = this.state.isLoading ? (
      ''
    ) : (
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
                  value={this.state.birthdate}
                  onChange={this.onChange}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor='phone'>Phone Number</label>
                <Input
                  type='number'
                  name='phone'
                  placeholder='Phone Number'
                  value={this.state.phone}
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
                <Button onClick={this.onFormSubmit}>Update</Button>
              </div>
            </div>
          </div>
          <div className={classes.editProfileAreaTitle}>
            <h4>Upload your CV</h4>
          </div>
          <div className={classes.cvUpload}>
            <form
              onSubmit={this.onCVSubmit}
              // enctype='multipart/form-data'
              // method='post'
            >
              <Input type='file' onChange={this.onChange} />
              <label htmlFor='file'>{this.state.fileName}</label>
              <p>Drag your file here or click to select file.</p>
              <div className={classes.buttonDiv}>
                <Button type='submit'>Upload</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
    return page;
  }
}

export default EditProfile;
