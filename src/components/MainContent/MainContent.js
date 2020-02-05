import React from 'react';
import { Switch, Route } from 'react-router-dom';

import classes from './MainContent.module.css';
import Header from '../Header/Header';
import ProfilePage from '../Pages/Profile/Profile';
import Courses from '../Pages/Courses/Courses';
import CoursesDescription from '../Pages/CoursesDescription/CoursesDescription';
import CoursesLog from '../Pages/CoursesLog/CoursesLog';
import CoursesMonitoring from '../Pages/CoursesMonitoring/CoursesMonitoring';
import Assignments from '../Pages/Assignments/Assignments';
import Papers from '../Pages/Papers/Papers';
import Quizzes from '../Pages/Quizzes/Quizzes';
import Reports from '../Pages/Reports/Reports';

const MainContent = () => {
  return (
    <div className={classes.mainContent}>
      <Header />
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
        <Route exact path='/coursesmonitoring' component={CoursesMonitoring} />
        <Route exact path='/assignments' component={Assignments} />
        <Route exact path='/papers' component={Papers} />
        <Route exact path='/quizzes' component={Quizzes} />
        <Route exact path='/reports' component={Reports} />
      </Switch>
    </div>
  );
};

export default MainContent;
