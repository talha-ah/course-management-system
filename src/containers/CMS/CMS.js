import React from 'react';

import classes from './CMS.module.css';
import Sidebar from '../../components/Sidebar/TeacherSidebar';
import MainContent from '../../components/MainContent/MainContent';
import Footer from '../../components/Footer/Footer';

const CMS = () => {
  return (
    <div className={classes.CMS}>
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default CMS;
