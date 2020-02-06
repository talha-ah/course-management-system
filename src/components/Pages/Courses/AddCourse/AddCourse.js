import React, { Component } from 'react';

import classes from './AddCourse.module.css';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';

class AddCourse extends Component {
  state = {
    courseTitle: '',
    courseCode: '',
    courseSection: '',
    courseSession: ''
  };

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    const courseTitle = this.state.courseTitle;
    const courseCode = this.state.courseCode;
    const courseSection = this.state.courseSection;
    const courseSession = this.state.courseSession;

    console.log(courseTitle, courseCode, courseSection, courseSession);
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
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
          {/* <form onSubmit={this.onFormSubmit}> */}
          <div className={classes.inputGroup}>
            <label htmlFor='courseTitle'>Course Title</label>
            <Input
              type='text'
              placeholder='Course Title'
              name='courseTitle'
              onChange={event => this.onChange(event)}
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
          <div className={classes.inputGroup}>
            <label htmlFor='courseSection'>Course Section</label>
            <Input
              type='text'
              placeholder='Section'
              name='courseSection'
              onChange={this.onChange}
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor='courseSession'>Session</label>
            <Input
              type='text'
              placeholder='Session'
              name='courseSession'
              onChange={this.onChange}
            />
          </div>
          {/* </form> */}
          <div className={classes.buttonDiv}>
            <Button onClick={this.props.addCoursePageHandler} color='#f83245'>
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
