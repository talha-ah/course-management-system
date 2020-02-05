import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faCalendarAlt,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons';

import classes from './ProfilePage.module.css';
import Button from '../../../UI/Button/Button';

const ProfilePage = props => {
  return (
    <div className={classes.profilePage}>
      <div className={classes.profileHeader}>
        <h3>Profile Page</h3>
        <p>
          This is your profile page. You can see the progress you've made with
          your courses and manage your profile
        </p>
      </div>
      <div className={classes.profileArea}>
        <div className={classes.profileInfo1}>
          <h4>Rana Abdul Rehman</h4>
          <div>Head of Department - Computer Science Department</div>
          <div>Government College University, Lahore</div>
        </div>
        <div className={classes.profileTitle}>
          <h4>Your Courses</h4>
        </div>
        <div className={classes.profileInfo2}>
          <div className={classes.profileInfo2Card}>
            Total Courses
            <div>15</div>
          </div>
          <div className={classes.profileInfo2Card}>
            Active Courses
            <div>6</div>
          </div>
        </div>
        <div className={classes.profileTitle}>
          <h4>Personal Details</h4>
        </div>
        <div className={classes.profileInfo3}>
          <div className={classes.profileInfo3Card}>
            <FontAwesomeIcon icon={faEnvelope} />
            <div>rana@gmail.com</div>
          </div>
          <div className={classes.profileInfo3Card}>
            <FontAwesomeIcon icon={faCalendarAlt} />
            <div>19-21-2022</div>
          </div>
          <div className={classes.profileInfo3Card}>
            <FontAwesomeIcon icon={faAddressBook} />
            <div>Near Shahi Qila, Lahore</div>
          </div>
        </div>
      </div>
      <div className={classes.buttonDiv}>
        <Button onClick={props.editingMode}>Edit Profile</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
