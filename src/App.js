import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faUser, faBell } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import logo from './logo.png';

class App extends Component {
  state = {
    profileDropDown: false,
    notificationDropDown: false
  };

  dropDownHandler = e => {
    console.log(e.target.getAttribute('name'));
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
    console.log(this.state);
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
      <div className='App'>
        <div className='navbar'>
          <a href='/' className='navbar-brand'>
            <img src={logo} alt='logo' className='navbar-brand-img' />
          </a>
          <ul className='nav'>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Dashboard
              </a>
            </li>
            <hr className='nav-hr' />
            <li className='nav-item'>
              <a href='/' className='nav-link nav-title'>
                Courses Section
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Courses
              </a>
            </li>
            <hr className='nav-hr' />
            <li className='nav-item'>
              <a href='/' className='nav-link nav-title'>
                NCEAC Forms
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Course Description
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Course Monitoring
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Course Log
              </a>
            </li>
            <hr className='nav-hr' />
            <li className='nav-item'>
              <a href='/' className='nav-link nav-title'>
                Materials
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Quizzes
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Assignments
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Papers
              </a>
            </li>
            <li className='nav-item'>
              <a href='/' className='nav-link'>
                <FontAwesomeIcon icon={faDotCircle} />
                Reports
              </a>
            </li>
          </ul>
        </div>
        <div className='main-content'>
          <div className='header-navbar'>
            <ul className='header-nav'>
              <li className='header-nav-item-switch'>Switch to Admin</li>
              <li className='header-nav-item '>
                <label className='switch'>
                  <input type='checkbox' />
                  <span className='slider round'></span>
                </label>
              </li>
              <li
                className='header-nav-item-float header-dropDown-parent'
                name='bell'
                onClick={event => this.dropDownHandler(event)}
              >
                <FontAwesomeIcon icon={faBell} />
                <div
                  className='header-dropDown'
                  style={
                    this.state.notificationDropDown
                      ? visibleStyles
                      : InvisibleStyles
                  }
                >
                  <div className='header-dropDown-title'>
                    <h6>Welcome!</h6>
                  </div>
                  <ul className='header-dropDown-ul'>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        My Profile
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Settings
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Activity
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Support
                      </a>
                    </li>
                    <hr />
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li
                className='header-nav-item header-dropDown-parent'
                name='profile'
                onClick={event => this.dropDownHandler(event)}
              >
                <FontAwesomeIcon icon={faUser} />
                <div
                  className='header-dropDown'
                  style={
                    this.state.profileDropDown ? visibleStyles : InvisibleStyles
                  }
                >
                  <div className='header-dropDown-title'>
                    <h6>Welcome!</h6>
                  </div>
                  <ul className='header-dropDown-ul'>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        My Profile
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Settings
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Activity
                      </a>
                    </li>
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Support
                      </a>
                    </li>
                    <hr />
                    <li className='header-dropDown-item'>
                      <a href='/'>
                        <FontAwesomeIcon icon={faDotCircle} />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className='content'></div>
        </div>
      </div>
    );
  }
}

export default App;
