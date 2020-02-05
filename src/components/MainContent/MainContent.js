import React from 'react';
import { Switch, Route } from 'react-router-dom';

import classes from './MainContent.module.css';
import Header from '../Header/Header';
import ProfilePage from '../Pages/Profile/Profile';
import Courses from '../Pages/Courses/Courses';

const MainContent = () => {
  return (
    <div className={classes.mainContent}>
      <Header />
      <Switch>
        <Route exact path='/' component={ProfilePage} />
        <Route exact path='/profile' component={ProfilePage} />
        <Route exact path='/courses' component={Courses} />
      </Switch>
    </div>
  );
};

export default MainContent;
