import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faUser, faBell } from '@fortawesome/free-solid-svg-icons';

import classes from './Header.module.css';

class Header extends Component {
  state = {
    profileDropDown: false,
    notificationDropDown: false
  };

  localMthod() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    if (!this.node.contains(e.target)) {
      this.setState(prevState => ({
        profileDropDown: false,
        notificationDropDown: false
      }));
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
  render() {
    this.localMthod();
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
          <li className={classes.headerNavItemSwitch}>Switch to Admin</li>
          <li className={classes.headerNavItem}>
            <label className={classes.switch}>
              <input type='checkbox' />
              <span
                className={[classes.slider, classes.round].join(' ')}
              ></span>
            </label>
          </li>
          <li
            className={[
              classes.headerNavItemFloat,
              classes.headerDropDownParent
            ].join(' ')}
            name='bell'
            onClick={event => this.dropDownHandler(event)}
          >
            <FontAwesomeIcon icon={faBell} />
            <div
              className={classes.headerDropDown}
              style={
                this.state.notificationDropDown
                  ? visibleStyles
                  : InvisibleStyles
              }
              ref={node => (this.node = node)}
            >
              <div className={classes.headerDropDownTitle}>
                <h6>Welcome!</h6>
              </div>
              <ul className={classes.headerDropDownUl}>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    My Profile
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Settings
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Activity
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Support
                  </NavLink>
                </li>
                <hr />
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Logout
                  </NavLink>
                </li>
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
          >
            <FontAwesomeIcon icon={faUser} />
            <div
              className={classes.headerDropDown}
              style={
                this.state.profileDropDown ? visibleStyles : InvisibleStyles
              }
              ref={node => (this.node = node)}
            >
              <div className={classes.headerDropDownTitle}>
                <h6>Welcome!</h6>
              </div>
              <ul className={classes.headerDropDownUl}>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    My Profile
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Settings
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Activity
                  </NavLink>
                </li>
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Support
                  </NavLink>
                </li>
                <hr />
                <li className={classes.headerDropDownItem}>
                  <NavLink exact to='/'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Header);
