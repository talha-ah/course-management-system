import React from 'react';
import { connect } from 'react-redux';

import classes from './CMS.module.css';
import TeacherSidebar from '../../components/Sidebar/TeacherSidebar';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import MainContent from '../../components/MainContent/MainContent';
import Footer from '../../components/Footer/Footer';

const CMS = props => {
  return (
    <div className={classes.CMS}>
      {props.isAdminSidebar ? <AdminSidebar /> : <TeacherSidebar />}
      <MainContent />
      <Footer />
    </div>
  );
};

const mapStateToProps = state => {
  return { isAdminSidebar: state.adminSidebar };
};

export default connect(mapStateToProps)(CMS);
