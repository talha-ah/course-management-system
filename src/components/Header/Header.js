import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faUser, faBell } from '@fortawesome/free-solid-svg-icons';

import classes from './Header.module.css';
import * as actionTypes from '../../store/actions';

class Header extends Component {
  state = {
    profileDropDown: false,
    notificationDropDown: false,
    notifications: {
      0: 1,
      1: 2,
      2: 3
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.state.profileDropDown) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.setState({ profileDropDown: false });
      }
    }
    if (this.state.notificationDropDown) {
      if (this.wrapperRef2 && !this.wrapperRef2.contains(event.target)) {
        this.setState({ notificationDropDown: false });
      }
    }
  };

  dropDownHandler = e => {
    if (e.target.getAttribute('name') === 'profile') {
      this.setState(prevState => ({
        profileDropDown: !prevState.profileDropDown,
        notificationDropDown: false
      }));
    } else if (e.target.getAttribute('name') === 'bell') {
      this.setState(prevState => ({
        notificationDropDown: !prevState.notificationDropDown,
        profileDropDown: false
      }));
    }
  };

  switchSidebarHandler = e => {
    this.props.history.push('/');
    this.props.switchSidebar();
  };

  render() {
    let InvisibleStyles = {
      width: '0px',
      height: '0px',
      visibility: 'hidden',
      opacity: '0'
    };
    let visibleStyles = {
      minWidth: '12rem',
      visibility: 'visible',
      opacity: '1'
    };

    return (
      <div className={classes.headerNavbar}>
        <ul className={classes.headerNav}>
          {this.props.isAdmin ? (
            <>
              <li className={classes.headerNavItemSwitch}>Switch to Admin</li>
              <li className={classes.headerNavItem}>
                <label className={classes.switch}>
                  <input type='checkbox' onChange={this.switchSidebarHandler} />
                  <span
                    className={[classes.slider, classes.round].join(' ')}
                  ></span>
                </label>
              </li>
            </>
          ) : (
            ''
          )}
          <li
            className={[
              classes.headerNavItemFloat,
              classes.headerDropDownParent
            ].join(' ')}
            name='bell'
            onClick={event => this.dropDownHandler(event)}
            ref={node => (this.wrapperRef2 = node)}
          >
            <FontAwesomeIcon icon={faBell} />
            <div
              className={classes.headerDropDown}
              style={
                this.state.notificationDropDown
                  ? visibleStyles
                  : InvisibleStyles
              }
            >
              <div className={classes.headerDropDownTitle}>
                <h6>Notifications</h6>
              </div>
              <ul className={classes.headerDropDownUl}>
                {Object.entries(this.state.notifications).map(noti => (
                  <li key={noti[0]} className={classes.headerDropDownItem}>
                    <div>
                      <FontAwesomeIcon icon={faDotCircle} />
                      {noti[1]}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li
            className={[
              classes.headerNavItem,
              classes.headerDropDownParent
            ].join(' ')}
            name='profile'
            onClick={event => this.dropDownHandler(event)}
            ref={node => (this.wrapperRef = node)}
          >
            <FontAwesomeIcon icon={faUser} />
            <div
              className={classes.headerDropDown}
              style={
                this.state.profileDropDown ? visibleStyles : InvisibleStyles
              }
            >
              <div className={classes.headerDropDownTitle}>
                <h6>Welcome!</h6>
              </div>
              <ul className={classes.headerDropDownUl}>
                <li
                  className={classes.headerDropDownItem}
                  onClick={() => this.props.history.push('/profile')}
                >
                  <div>
                    <FontAwesomeIcon icon={faDotCircle} />
                    My Profile
                  </div>
                </li>

                <hr />
                <li
                  className={classes.headerDropDownItem}
                  onClick={this.props.logoutHandler}
                >
                  <div>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    switchSidebar: () => dispatch({ type: actionTypes.SWITCH_SIDEBAR })
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Header));
