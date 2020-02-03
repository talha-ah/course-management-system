import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faCalendarAlt,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons';

import './Profile.css';
import Button from '../../UI/Button/Button';

const Profile = () => {
  return (
    <div className='profile'>
      <div className='profile-header'>
        <h3>Profile Page</h3>
        <p>
          This is your profile page. You can see the progress you've made with
          your courses and manage your profile
        </p>
      </div>
      <div className='profile-area'>
        <div className='profile-info-1'>
          <h4>Rana Abdul Rehman</h4>
          <div>Head of Department - Computer Science Department</div>
          <div>Government College University, Lahore</div>
        </div>
        <div className='profile-title'>
          <h4>Your Courses</h4>
        </div>
        <div className='profile-info-2'>
          <div className='profile-info-2-card'>
            Total Courses
            <div>15</div>
          </div>
          <div className='profile-info-2-card'>
            Active Courses
            <div>6</div>
          </div>
        </div>
        <div className='profile-title'>
          <h4>Personal Details</h4>
        </div>
        <div className='profile-info-3'>
          <div className='profile-info-3-card'>
            <FontAwesomeIcon icon={faEnvelope} />
            <div>rana@gmail.com</div>
          </div>
          <div className='profile-info-3-card'>
            <FontAwesomeIcon icon={faCalendarAlt} />
            <div>19-21-2022</div>
          </div>
          <div className='profile-info-3-card'>
            <FontAwesomeIcon icon={faAddressBook} />
            <div>Near Shahi Qila, Lahore</div>
          </div>
        </div>
      </div>
      <div className='button-div'>
        <Button link='/'>Edit Profile</Button>
      </div>
    </div>
  );
};

export default Profile;
