import React, { Component } from 'react';

import classes from './AddCourse.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddCourse extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    courses: '',
    coursesArray: [],
    courseTitle: '',
    courseSection: '',
    courseSession: ''
  };

  componentDidMount() {
    fetch('http://localhost:8080/teacher/listcourses', {
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
        const arrayCourses = [];
        resData.courses.map(course => arrayCourses.push(course.title));
        this.setState({
          courses: resData.courses,
          coursesArray: arrayCourses,
          pageLoading: false
        });
      })
      .catch(err => {
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
  }

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: true });
    const courseTitle = this.state.courseTitle;
    var courseId;

    this.state.courses.some(course => {
      if (course.title === courseTitle) {
        courseId = course._id;
        return true;
      }
      return false;
    });

    fetch('http://localhost:8080/teacher/takecourse', {
      method: 'POST',
      body: JSON.stringify({
        courseId: courseId,
        sections: this.state.courseSection,
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

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  onFormCancel = () => {
    this.props.history.goBack();
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddCourse}>
        <div className={classes.Title}>
          <h4>Add Course</h4>
        </div>
        <form
          className={classes.Form}
          onSubmit={this.onFormSubmit}
          method='POST'
        >
          <div className={classes.InputDiv}>
            <label htmlFor='courseTitle'>Course Title</label>
            <SelectInput
              name='courseTitle'
              placeholder='Course Title'
              onChange={this.onChange}
              disabled=''
              defaultValue=''
            >
              {this.state.coursesArray}
            </SelectInput>
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseSection'>Course Section</label>
            <Input
              type='text'
              name='courseSection'
              placeholder='Course Section'
              value={this.state.courseSection}
              onChange={this.onChange}
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
            />
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='button' onClick={this.onFormCancel} color='#f83245'>
              Cancel
            </Button>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddCourse;
