import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faCalendarAlt,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons';

import classes from './ProfilePage.module.css';
import Button from '../../../../UI/Button/Button';

class ProfilePage extends Component {
  state = {
    isLoading: true,
    teacher: ''
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
        if (resData.teacher.status === 'Pending') {
          this.setState({ isLoading: false });
          this.props.history.push('/editprofile');
        } else {
          this.setState({ teacher: resData.teacher, isLoading: false });
        }
      })
      .catch(err => {
        console.log('ProfilePageError', err);
      });
  }

  editHandler = e => {
    e.preventDefault();
    this.props.history.push('/editprofile');
  };

  render() {
    const page = this.state.isLoading ? (
      ''
    ) : (
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
            <h4>
              {this.state.teacher.firstName} {this.state.teacher.lastName}
            </h4>
            <div>{this.state.teacher.role} - Computer Science Department</div>
            <div>Government College University, Lahore</div>
          </div>
          <div className={classes.profileTitle}>
            <h4>Your Courses</h4>
          </div>
          <div className={classes.profileInfo2}>
            <div className={classes.profileInfo2Card}>
              Total Courses
              <div>{this.state.teacher.totalCourses}</div>
            </div>
            <div className={classes.profileInfo2Card}>
              Active Courses
              <div>{this.state.teacher.activeCourses}</div>
            </div>
          </div>
          <div className={classes.profileTitle}>
            <h4>Personal Details</h4>
          </div>
          <div className={classes.profileInfo3}>
            <div className={classes.profileInfo3Card}>
              <FontAwesomeIcon icon={faEnvelope} />
              <div>{this.state.teacher.email}</div>
            </div>
            <div className={classes.profileInfo3Card}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <div>{this.state.teacher.dob}</div>
            </div>
            <div className={classes.profileInfo3Card}>
              <FontAwesomeIcon icon={faAddressBook} />
              <div>{this.state.teacher.address}</div>
            </div>
          </div>
        </div>
        <div className={classes.buttonDiv}>
          <Button onClick={event => this.editHandler(event)}>
            Edit Profile
          </Button>
        </div>
      </div>
    );

    return page;
  }
}

export default ProfilePage;
