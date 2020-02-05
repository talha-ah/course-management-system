import React from 'react';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <div className={classes.footer}>
      <ul className={classes.footerNav}>
        <li className={classes.footerNavItem}>
          <a href='/terms'>Terms of Use</a>
        </li>
        <li className={classes.footerNavItem}>
          <a href='/support'>Support</a>
        </li>
        <li className={classes.footerNavItem}>
          <div>
            © 2019 <span className={classes.footerNavSpan}>DCS, GCU</span>{' '}
            <span>All rights reserved</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
