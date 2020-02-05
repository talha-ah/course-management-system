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

import classes from './Sidebar.module.css';
import logo from '../../logo.png';

const Sidebar = () => {
  return (
    <div className={classes.Sidebar}>
      <a href='/' className={classes.SidebarBrand}>
        <img src={logo} alt='logo' className={classes.SidebarBrandImg} />
      </a>
      <ul className={classes.SidebarNav}>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faTachometerAlt} />
            Dashboard
          </a>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <a
            href='/'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Courses Section
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileAlt} />
            Courses
          </a>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <a
            href='/'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            NCEAC Forms
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileAlt} />
            Course Description
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileMedicalAlt} />
            Course Monitoring
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboardList} />
            Course Log
          </a>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <a
            href='/'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Materials
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faPollH} />
            Quizzes
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faBookReader} />
            Assignments
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faBookOpen} />
            Papers
          </a>
        </li>
        <li className={classes.SidebarNavItem}>
          <a href='/' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboard} />
            Reports
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
