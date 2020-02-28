import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';

import classes from './AddCourse.module.css';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';

class AddCourse extends Component {
  state = {
    courseTitle: '',
    courseCode: ''
  };

  onFormSubmit = e => {
    const courseTitle = this.state.courseTitle;
    const courseCode = this.state.courseCode;

    console.log(courseTitle, courseCode);
    this.props.history.push('/courses');
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  onFormCancel = e => {
    this.props.history.push('/courses');
  };

  render() {
    return (
      <div className={classes.AddCourse}>
        <div className={classes.AddCourseHeader}>
          <h3>Add a Course</h3>
          <p>
            This is your AddCourse page. You can assign a course to you that you
            want to teach
          </p>
        </div>
        <div className={classes.AddCourseArea}>
          <div className={classes.form}>
            <div className={classes.inputGroup}>
              <label htmlFor='courseTitle'>Course Title</label>
              <Input
                type='text'
                placeholder='Course Title'
                name='courseTitle'
                onChange={this.onChange}
              />
            </div>
            <div className={classes.inputGroup}>
              <label htmlFor='courseCode'>Course Code</label>
              <Input
                type='text'
                placeholder='Course Code'
                name='courseCode'
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={classes.buttonDiv}>
            <Button onClick={this.onFormCancel} color='#f83245'>
              Cancel
            </Button>
            <Button onClick={this.onFormSubmit}>Create</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCourse;
