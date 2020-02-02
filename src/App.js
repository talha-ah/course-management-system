import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faUser, faBell } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import logo from './logo.png';

function App() {
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
            <li className='header-nav-item-float'>
              <FontAwesomeIcon icon={faBell} />
            </li>
            <li className='header-nav-item'>
              <FontAwesomeIcon icon={faUser} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
