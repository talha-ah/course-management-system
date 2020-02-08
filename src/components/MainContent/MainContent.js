import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './MainContent.module.css';
import Header from '../Header/Header';

// Admin Imports
import AdminProfile from '../Pages/AdminPages/Profile/Profile';

// Teacher Imports
import ProfilePage from '../Pages/TeacherPages/Profile/Profile';
import Courses from '../Pages/TeacherPages/Courses/Courses';
import CoursesDescription from '../Pages/TeacherPages/CoursesDescription/CoursesDescription';
import CoursesLog from '../Pages/TeacherPages/CoursesLog/CoursesLog';
import CoursesMonitoring from '../Pages/TeacherPages/CoursesMonitoring/CoursesMonitoring';
import Assignments from '../Pages/TeacherPages/Assignments/Assignments';
import Papers from '../Pages/TeacherPages/Papers/Papers';
import Quizzes from '../Pages/TeacherPages/Quizzes/Quizzes';
import Reports from '../Pages/TeacherPages/Reports/Reports';

const MainContent = props => {
  return (
    <div className={classes.mainContent}>
      <Header />
      {props.isAdmin ? (
        <Switch>
          <Route exact path='/' component={AdminProfile} />
          <Route exact path='/profile' component={AdminProfile} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path='/' component={ProfilePage} />
          <Route exact path='/profile' component={ProfilePage} />
          <Route exact path='/courses' component={Courses} />
          <Route
            exact
            path='/coursesdescription'
            component={CoursesDescription}
          />
          <Route exact path='/courseslog' component={CoursesLog} />
          <Route
            exact
            path='/coursesmonitoring'
            component={CoursesMonitoring}
          />
          <Route exact path='/assignments' component={Assignments} />
          <Route exact path='/papers' component={Papers} />
          <Route exact path='/quizzes' component={Quizzes} />
          <Route exact path='/reports' component={Reports} />
        </Switch>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAdmin: state.adminSidebar
  };
};

export default connect(mapStateToProps)(MainContent);
