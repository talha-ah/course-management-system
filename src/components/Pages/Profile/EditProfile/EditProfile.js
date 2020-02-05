import React from 'react';

import './EditProfile.css';
import Button from '../../../UI/Button/Button';

const EditProfile = props => {
  return (
    <div className='editProfile'>
      <div className='editProfile-header'>
        <h3>Profile Page</h3>
        <p>
          This is your profile page. You can see the progress you've made with
          your courses and manage your profile
        </p>
      </div>
      <div className='editProfile-area'>
        <div className='editProfile-area-div'>
          <div className='editProfile-area-1'>
            <div className='editProfile-area-title'>
              <h4>Basic Information</h4>
            </div>
            <div className='input-div'>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                name='email'
                placeholder='Email Address'
                className='input-div-input'
              />
            </div>
            <div className='button-div'>
              <Button onClick={props.editingMode}>Update</Button>
            </div>
          </div>
          <div className='editProfile-area-2'>
            <div className='editProfile-area-title'>
              <h4>Personal Information</h4>
            </div>
            <div className='input-div'>
              <label htmlFor='birthdate'>Birthdate</label>
              <input
                type='text'
                name='birthdate'
                placeholder='Birthdate'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='phone'>Phone Number</label>
              <input
                type='number'
                name='phone'
                placeholder='Phone Number'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='address'>Address</label>
              <input
                type='text'
                name='address'
                placeholder='Address'
                className='input-div-input'
              />
            </div>
            <div className='button-div'>
              <Button onClick={props.editingMode}>Update</Button>
            </div>
          </div>
          <div className='editProfile-area-3'>
            <div className='editProfile-area-title'>
              <h4>Change Password</h4>
            </div>
            <div className='input-div'>
              <label htmlFor='currentPassword'>Current Password</label>
              <input
                type='password'
                name='currentPassword'
                placeholder='Current Password'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='newPassword'>New Password</label>
              <input
                type='password'
                name='newPassword'
                placeholder='New Password'
                className='input-div-input'
              />
            </div>
            <div className='input-div'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                className='input-div-input'
              />
            </div>
            <div className='button-div'>
              <Button onClick={props.editingMode}>Update</Button>
            </div>
          </div>
        </div>
        <div className='editProfile-area-title'>
          <h4>Upload your CV</h4>
        </div>
        <div className='cvUpload'>
          <form action='' method='POST'>
            <input type='file' />
            <p>Drag your file here or click to select file.</p>
            <div className='button-div'>
              <Button type='submit'>Upload</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
