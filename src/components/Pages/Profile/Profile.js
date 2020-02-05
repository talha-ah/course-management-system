import React, { Component } from 'react';

import classes from './Profile.module.css';
import ProfilePage from './ProfilePage/ProfilePage';
import EditProfile from './EditProfile/EditProfile';

class Profile extends Component {
  state = {
    isProfileEditing: false
  };

  handlerEditingMode = () => {
    this.setState({ isProfileEditing: !this.state.isProfileEditing });
  };

  render() {
    return (
      <div className={classes.Profile}>
        {this.state.isProfileEditing ? (
          <EditProfile editingMode={this.handlerEditingMode} />
        ) : (
          <ProfilePage editingMode={this.handlerEditingMode} />
        )}
      </div>
    );
  }
}

export default Profile;
