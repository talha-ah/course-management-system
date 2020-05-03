import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // faFileMedicalAlt,
  faBook,
  faUser,
  // faBookReader,
  faClipboard,
  faPollH,
} from '@fortawesome/free-solid-svg-icons';

import classes from './Sidebar.module.css';
import logo from '../../assets/Logo/logo.png';

const Sidebar = () => {
  return (
    <div className={classes.Sidebar}>
      <NavLink to='/' className={classes.SidebarBrand}>
        <img src={logo} alt='logo' className={classes.SidebarBrandImg} />
      </NavLink>
      <ul className={classes.SidebarNav}>
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/profile'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faUser} />
            Profile
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            to='/'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Courses Section
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faBook} />
            Courses
          </NavLink>
        </li>
        {/* <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/addcourse'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faFileMedicalAlt} />
            Add Course
          </NavLink>
        </li> */}

        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            to='/teachers'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Teachers Section
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/teachers'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faPollH} />
            Teachers
          </NavLink>
        </li>
        {/* <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/addteacher'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faBookReader} />
            Add Teacher
          </NavLink>
        </li> */}
        <li className={classes.SidebarNavItem}>
          <NavLink
            exact
            to='/reports'
            className={classes.SidebarNavLink}
            activeClassName={classes.activeLink}
          >
            <FontAwesomeIcon icon={faClipboard} />
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
