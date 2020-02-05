import React from 'react';

import classes from './Courses.module.css';

const Courses = () => {
  return (
    <div className={classes.Courses}>
      <div className={classes.coursesHeader}>
        <h3>Courses Page</h3>
        <p>
          This is your Courses page. You can see the progress you've made with
          your courses here and manage them
        </p>
      </div>
      <div className={classes.coursesArea}></div>
    </div>
  );
};

export default Courses;
