import React, { Component } from 'react';

import './Profile.css';
import ProfilePage from './ProfilePage/ProfilePage';
import EditProfile from './EditProfile/EditProfile';

class Profile extends Component {
  state = {
    isProfileEditing: true
  };

  handlerEditingMode = () => {
    this.setState({ isProfileEditing: !this.state.isProfileEditing });
  };

  render() {
    return (
      <div>
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
