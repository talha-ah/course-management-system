import React from 'react';

import classes from './MainContent.module.css';
import Header from '../Header/Header';
import ProfilePage from '../Pages/Profile/Profile';

const MainContent = () => {
  return (
    <div className={classes.mainContent}>
      <Header />
      <ProfilePage />
    </div>
  );
};

export default MainContent;
