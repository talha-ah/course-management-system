import React from 'react';

import './Footer.css';

const Footer = () => {
  return (
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
  );
};

export default Footer;
