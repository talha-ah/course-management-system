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
    admin: ''
  };

  componentDidMount() {
    const adminId = '5e4cc4d495df8118f0583582';
    fetch(`http://localhost:8080/admin/getadmin/${adminId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error(res.error);
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ admin: resData.admin, isLoading: false });
      })
      .catch(err => {
        console.log('AdminProfile', err);
      });
  }

  componentWillUnmount() {
    var controller = new AbortController();
    controller.abort();
  }

  editHandler = () => {
    this.props.history.push('/editprofile');
  };

  render() {
    const page = this.state.isLoading ? (
      <center>Loading...</center>
    ) : (
      <div className={classes.profilePage}>
        <div className={classes.profileHeader}>
          <h3>Admin Profile Page</h3>
          <p>This is your profile page.</p>
        </div>
        <div className={classes.profileArea}>
          <div className={classes.profileInfo1}>
            <h4>
              {this.state.admin.firstName} {this.state.admin.lastName}
            </h4>
            <div>Course Management Admin - Computer Science Department</div>
            <div>Government College University, Lahore</div>
          </div>
          <div className={classes.profileTitle}>
            <h4>Personal Details</h4>
          </div>
          <div className={classes.profileInfo3}>
            <div className={classes.profileInfo3Card}>
              <FontAwesomeIcon icon={faEnvelope} />
              <div>{this.state.admin.email}</div>
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
          <Button onClick={this.editHandler}>Edit Profile</Button>
        </div>
      </div>
    );
    return page;
  }
}
export default ProfilePage;
