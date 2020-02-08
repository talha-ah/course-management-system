import React from 'react';

import classes from './Papers.module.css';

const Papers = () => {
  return (
    <div className={classes.Papers}>
      <div className={classes.PapersHeader}>
        <h3>Papers Page</h3>
        <p>
          This is your Papers page. You can see the progress you've made with
          your Papers here and manage them
        </p>
      </div>
      <div className={classes.PapersArea}></div>
    </div>
  );
};

export default Papers;
