import React, { Component } from 'react';

import classes from './Assignments.module.css';

class Assignments extends Component {
  state = {};

  componentDidMount() {
    const courseId = this.props.match.params.courseId;
    console.log(courseId);
  }

  render() {
    return (
      <div className={classes.Assignments}>
        <div className={classes.AssignmentsHeader}>
          <h3>Assignments Page</h3>
          <p>
            This is your Assignments page. You can see the progress you've made
            with your Assignments here and manage them
          </p>
        </div>
        <div className={classes.AssignmentsArea}></div>
      </div>
    );
  }
}

export default Assignments;
