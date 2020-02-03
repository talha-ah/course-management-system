import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileMedicalAlt,
  faClipboardList,
  faFileAlt,
  faTachometerAlt,
  faBookReader,
  faBookOpen,
  faClipboard,
  faPollH
} from '@fortawesome/free-solid-svg-icons';

import './Sidebar.css';
import logo from '../../logo.png';

const Sidebar = () => {
  return (
    <div className='Sidebar'>
      <a href='/' className='Sidebar-brand'>
        <img src={logo} alt='logo' className='Sidebar-brand-img' />
      </a>
      <ul className='Sidebar-nav'>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faTachometerAlt} />
            Dashboard
          </a>
        </li>
        <hr className='Sidebar-nav-hr' />
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link Sidebar-nav-title'>
            Courses Section
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faFileAlt} />
            Courses
          </a>
        </li>
        <hr className='Sidebar-nav-hr' />
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link Sidebar-nav-title'>
            NCEAC Forms
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faFileAlt} />
            Course Description
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faFileMedicalAlt} />
            Course Monitoring
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faClipboardList} />
            Course Log
          </a>
        </li>
        <hr className='Sidebar-nav-hr' />
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link Sidebar-nav-title'>
            Materials
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faPollH} />
            Quizzes
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faBookReader} />
            Assignments
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faBookOpen} />
            Papers
          </a>
        </li>
        <li className='Sidebar-nav-item'>
          <a href='/' className='Sidebar-nav-link'>
            <FontAwesomeIcon icon={faClipboard} />
            Reports
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
