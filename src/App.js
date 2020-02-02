import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

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
              Course Log
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
              Course Description
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
    </div>
  );
}

export default App;
