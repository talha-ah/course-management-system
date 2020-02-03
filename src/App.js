import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDotCircle,
  faUser,
  faBell,
  faEnvelope,
  faCalendarAlt,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons';

import './App.css';
import logo from './logo.png';

class App extends Component {
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
      <div className='App'>
        {/* SideBar Starts */}
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
        {/* Sidebar Ends */}
        {/* Main Content Starts */}
        <div className='main-content'>
          {/* Header Navigation Ends*/}
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
                  ref={node => (this.node = node)}
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
                  ref={node => (this.node = node)}
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
          {/* Header Navigation Ends */}
          {/* Page Content Starts */}
          <div className='page-content'>
            <div className='page-content-header'>
              <h3>Profile Page</h3>
              <p>
                This is your profile page. You can see the progress you've made
                with your courses and manage your profile
              </p>
            </div>
            <div className='page-content-area'>
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
          </div>
        </div>
        {/* Page Content Ends */}
        {/* Main Content Ends */}
        {/* Footer Starts */}
        <div className='footer'>
          <ul className='footer-nav'>
            <li className='footer-nav-item'>
              <a href='/terms'>Terms of Use</a>
            </li>
            <li className='footer-nav-item'>
              <a href='/support'>Support</a>
            </li>
            <li className='footer-nav-item'>
              <div>
                © 2019 <span className='footer-nav-span'>DCS, GCU</span>{' '}
                <span>All rights reserved</span>
              </div>
            </li>
          </ul>
        </div>
        {/* Footer Ends */}
      </div>
    );
  }
}

export default App;
