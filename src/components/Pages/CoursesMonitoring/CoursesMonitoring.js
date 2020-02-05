import React from 'react';

import classes from './CoursesMonitoring.module.css';

const CoursesMonitoring = () => {
  return (
    <div className={classes.CoursesMonitoring}>
      <div className={classes.coursesMonitoringHeader}>
        <h3>CoursesMonitoring Page</h3>
        <p>
          This is your CoursesMonitoring page. You can see the progress you've
          made with your coursesMonitoring here and manage them
        </p>
      </div>
      <div className={classes.coursesMonitoringArea}></div>
    </div>
  );
};

export default CoursesMonitoring;
