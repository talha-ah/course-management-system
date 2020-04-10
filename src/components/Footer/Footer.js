import React from 'react';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <div className={classes.Footer}>
      <ul className={classes.FooterNav}>
        <li className={classes.FooterNavItem}>
          <a href='/terms'>Terms of Use</a>
        </li>
        <li className={classes.FooterNavItem}>
          <a href='/support'>Support</a>
        </li>
        <li className={classes.FooterNavItem}>
          <div>
            © 2019 <span className={classes.FooterNavSpan}>DCS, GCU</span>{' '}
            <span>All rights reserved</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
