import React, { Component } from 'react';

import classes from './Course.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Input from '../../../../UI/Input/Input';
import Button from '../../../../UI/Button/Button';

class Course extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    _id: '',
    courseId: '',
    courseTitle: '',
    courseCode: '',
    courseType: '',
    courseStatus: '',
    courseSections: '',
    courseSession: '',
    courseLog: '',
    courseDescriptions: '',
    courseMonitorings: '',
    courseAssignments: '',
    coursePapers: '',
    courseQuizzes: ''
  };

  componentDidMount() {
    const courseId = this.props.match.params.courseId;
    fetch(`http://localhost:8080/teacher/course/${courseId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        this.setState({
          _id: resData.course.course._id,
          courseId: resData.course.course.courseId,
          courseTitle: resData.course.course.title,
          courseCode: resData.course.course.code,
          courseType: resData.course.course.type,
          courseSections: resData.course.course.sections,
          courseSession: resData.course.course.session,
          courseStatus: resData.course.course.status,
          courseLog: resData.course.courseLog,
          courseDescriptions: resData.course.courseDescription,
          courseMonitorings: resData.course.courseMonitoring,
          courseAssignments: resData.course.assignments,
          coursePapers: resData.course.papers,
          courseQuizzes: resData.course.quizzes,
          pageLoading: false
        });
      })
      .catch(err => {
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message ', body.message);
          });
        } catch (err) {
          console.log('Error parsing the error');
          console.log(err);
        }
      });
  }

  onChange = e => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: true });

    fetch('http://localhost:8080/teacher/editcourse', {
      method: 'POST',
      body: JSON.stringify({
        courseId: this.state._id,
        sections: this.state.courseSections,
        session: this.state.courseSession
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
      });
  };

  onDeleteHandler = () => {
    this.setState({ isLoading: true });

    fetch(`http://localhost:8080/teacher/removecourse/${this.state._id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ isLoading: false });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
      });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Course}>
        <div className={classes.Title}>
          <h4>
            Course : {this.state.courseTitle} --- '{this.state.courseStatus}'
          </h4>
        </div>
        <form
          className={classes.Form}
          onSubmit={this.onFormSubmit}
          method='POST'
        >
          <div className={classes.InputDiv}>
            <label htmlFor='courseTitle'>Course Title</label>
            <Input
              type='text'
              name='courseTitle'
              placeholder='Course Title'
              value={this.state.courseTitle}
              onChange={this.onChange}
              disabled='disabled'
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseCode'>Course Code</label>
            <Input
              type='text'
              name='courseCode'
              placeholder='Course Code'
              value={this.state.courseCode}
              onChange={this.onChange}
              disabled='disabled'
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseType'>Course Type</label>
            <Input
              type='text'
              name='courseType'
              placeholder='Course Type'
              value={this.state.courseType}
              onChange={this.onChange}
              disabled='disabled'
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseSession'>Course Session</label>
            <Input
              type='text'
              name='courseSession'
              placeholder='Course Session'
              value={this.state.courseSession}
              onChange={this.onChange}
              disabled='disabled'
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseSections'>Course Sections</label>
            <Input
              type='text'
              name='courseSections'
              placeholder='Course Sections'
              value={this.state.courseSections}
              onChange={this.onChange}
              disabled={
                this.state.courseStatus === 'Inactive' ? 'disabled' : ''
              }
            />
          </div>
          <div className={classes.ButtonDiv}>
            <Button
              type='submit'
              disabled={
                this.state.courseStatus === 'Inactive' ? 'disabled' : ''
              }
            >
              {this.state.isLoading ? 'Loading...' : 'Update'}
            </Button>
            <Button
              type='button'
              // disabled={
              //   this.state.courseStatus === 'Inactive' ? 'disabled' : ''
              // }
              buttonType='red'
              onClick={this.onDeleteHandler}
            >
              {this.state.isLoading ? 'Loading...' : 'Delete'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default Course;
