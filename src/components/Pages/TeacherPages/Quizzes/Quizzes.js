import React from 'react';

import classes from './Quizzes.module.css';

const Quizzes = () => {
  return (
    <div className={classes.Quizzes}>
      <div className={classes.QuizzesHeader}>
        <h3>Quizzes Page</h3>
        <p>
          This is your Quizzes page. You can see the progress you've made with
          your Quizzes here and manage them
        </p>
      </div>
      <div className={classes.QuizzesArea}></div>
    </div>
  );
};

export default Quizzes;
