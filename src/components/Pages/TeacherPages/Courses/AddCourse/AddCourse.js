import React, { Component } from 'react';

import classes from './AddCourse.module.css';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddCourse extends Component {
  state = {
    isLoading: true,
    courses: '',
    coursesArray: [],
    courseTitle: '',
    courseSection: '',
    courseSession: ''
  };

  componentDidMount() {
    fetch('http://localhost:8080/teacher/listcourses')
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Unknown Status Code.');
        }
        return res.json();
      })
      .then(resData => {
        const arrayCourses = [];
        resData.courses.map(course => arrayCourses.push(course.title));
        this.setState({
          courses: resData.courses,
          coursesArray: arrayCourses,
          isLoading: false
        });
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit

    const courseTitle = this.state.courseTitle;
    var courseId;

    this.state.courses.map(course => {
      if (course.title === courseTitle) {
        courseId = course._id;
      }
      return true;
    });

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('courseSection', this.state.courseSection);
    formData.append('courseSession', this.state.courseSession);

    const teacherId = '5e4cc7a4781ba62684fe3892';
    fetch(`http://localhost:8080/teacher/takecourse/${teacherId}`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.status !== 201 || resData.status !== 200) {
          const error = new Error(resData.message);
          throw error;
        }
        this.props.history.goback();
        console.log('Course Added!');
      })
      .catch(err => {
        console.log('AddCourseFormSubmit', err);
      });
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  cancelHandler = () => {
    this.props.history.goBack();
  };

  render() {
    const page = this.state.isLoading ? (
      ''
    ) : (
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
              <SelectInput
                name='courseTitle'
                placeholder='Select Course'
                onChange={this.onChange}
                disabled=''
                defaultValue=''
              >
                {this.state.coursesArray}
              </SelectInput>
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
          </div>
          <div className={classes.buttonDiv}>
            <Button onClick={this.cancelHandler} color='#f83245'>
              Cancel
            </Button>
            <Button onClick={this.onFormSubmit}>Create</Button>
          </div>
        </div>
      </div>
    );
    return page;
  }
}

export default AddCourse;
