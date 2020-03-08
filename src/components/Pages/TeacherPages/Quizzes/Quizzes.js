import React, { Component } from 'react';

import classes from './Quizzes.module.css';

class Quizzes extends Component {
  state = {};

  componentDidMount() {
    const courseId = this.props.match.params.courseId;
    console.log(courseId);
  }

  render() {
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
  }
}

export default Quizzes;
