import React from 'react';

import classes from './CoursesLog.module.css';

const CoursesLog = () => {
  return (
    <div className={classes.CoursesLog}>
      <div className={classes.coursesLogHeader}>
        <h3>CoursesLog Page</h3>
        <p>
          This is your CoursesLog page. You can see the progress you've made
          with your coursesLog here and manage them
        </p>
      </div>
      <div className={classes.coursesLogArea}></div>
    </div>
  );
};

export default CoursesLog;
