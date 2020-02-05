import React from 'react';

import classes from './CoursesDescription.module.css';

const CoursesDescription = () => {
  return (
    <div className={classes.CoursesDescription}>
      <div className={classes.coursesDescriptionHeader}>
        <h3>CoursesDescription Page</h3>
        <p>
          This is your CoursesDescription page. You can see the progress you've
          made with your coursesDescription here and manage them
        </p>
      </div>
      <div className={classes.coursesDescriptionArea}></div>
    </div>
  );
};

export default CoursesDescription;
