import React, { Component } from 'react';

import classes from './Courses.module.css';
import CoursesList from './CoursesList/CoursesList';
import AddCourse from './AddCourse/AddCourse';

class Courses extends Component {
  state = {
    addCourse: false
  };

  addCoursePageHandler = () => {
    this.setState(prevState => ({ addCourse: !prevState.addCourse }));
  };
  render() {
    return (
      <div className={classes.Courses}>
        {this.state.addCourse ? (
          <AddCourse addCoursePageHandler={this.addCoursePageHandler} />
        ) : (
          <CoursesList addCoursePageHandler={this.addCoursePageHandler} />
        )}
      </div>
    );
  }
}

export default Courses;
