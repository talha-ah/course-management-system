import React from 'react';

import './MainContent.css';
import Header from '../Header/Header';
import ProfilePage from '../Pages/Profile/Profile';

const MainContent = () => {
  return (
    <div className='main-content'>
      <Header />
      <ProfilePage />
    </div>
  );
};

export default MainContent;
