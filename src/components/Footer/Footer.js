import React from 'react';
// import { Link } from 'react-router-dom';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <div className={classes.Footer}>
      <ul className={classes.FooterNav}>
        {/* <li className={classes.FooterNavItem}>
          <Link to='/terms'>Terms of Use</Link>
        </li>
        <li className={classes.FooterNavItem}>
          <Link to='/support'>Support</Link>
        </li> */}
        <li className={classes.FooterNavItem}>
          <div>
            {/* Made with <span style={{ color: '#e25555' }}>❤</span> by{' '} */}
            Developers: <strong>Muhammad Talha Ahmed</strong> and{' '}
            <strong>Humza Bashir</strong> - <strong>DCS, GCU</strong>{' '}
            <span>© 2019 All rights reserved</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
