import React from 'react';
import { NavLink } from 'react-router-dom';
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
import logo from '../../assets/Logo/logo.png';

const Sidebar = () => {
  return (
    <div className={classes.Sidebar}>
      <NavLink to='/admin' className={classes.SidebarBrand}>
        <img src={logo} alt='logo' className={classes.SidebarBrandImg} />
      </NavLink>
      <ul className={classes.SidebarNav}>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/profile' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faTachometerAlt} />
            Dashboard
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            to='/admin/courses'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Courses Section
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/courses' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileAlt} />
            Courses
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/addcourse' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faFileMedicalAlt} />
            Add Course
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/disablecourse' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboardList} />
            Disable Course
          </NavLink>
        </li>
        <hr className={classes.SidebarNavHr} />
        <li className={classes.SidebarNavItem}>
          <NavLink
            to='/admin/teachers'
            className={[classes.SidebarNavLink, classes.SidebarNavTitle].join(
              ' '
            )}
          >
            Teachers Section
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/teachers' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faPollH} />
            Teachers
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/addteacher' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faBookReader} />
            Add Teacher
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink
            to='/admin/deactivateteacher'
            className={classes.SidebarNavLink}
          >
            <FontAwesomeIcon icon={faBookOpen} />
            Deactivate Teacher
          </NavLink>
        </li>
        <li className={classes.SidebarNavItem}>
          <NavLink to='/admin/reports' className={classes.SidebarNavLink}>
            <FontAwesomeIcon icon={faClipboard} />
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
