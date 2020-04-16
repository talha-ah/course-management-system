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
    courseSession: '',
  };

  abortController = new AbortController();

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/listcourses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        const arrayCourses = [];
        resData.courses.map((course) => {
          if (course.status === 'Active') {
            return arrayCourses.push(course.title);
          }
          return true;
        });
        this.setState({
          courses: resData.courses,
          coursesArray: arrayCourses,
          pageLoading: false,
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
          try {
            err.json().then((body) => {
              this.props.notify(
                true,
                'Error',
                body.error.status + ' ' + body.message
              );
            });
          } catch (e) {
            this.props.notify(
              true,
              'Error',
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  onFormSubmit = (e) => {
    e.preventDefault(); // Stop form submit
    this.setState({ isLoading: true });
    const courseTitle = this.state.courseTitle;
    var courseId;

    this.state.courses.some((course) => {
      if (course.title === courseTitle) {
        courseId = course._id;
        return true;
      }
      return false;
    });

    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/takecourse`, {
      method: 'POST',
      body: JSON.stringify({
        courseId: courseId,
        sections: this.state.courseSection,
        session: this.state.courseSession,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
      signal: this.abortController.signal,
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.props.notify(true, 'Success', resData.message);
        this.props.history.push('/');
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
        } else {
          try {
            err.json().then((body) => {
              this.props.notify(
                true,
                'Error',
                body.error.status + ' ' + body.message
              );
            });
          } catch (e) {
            this.props.notify(
              true,
              'Error',
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  };

  onChange = (e) => {
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
            <Button type='button' onClick={this.onFormCancel} buttonType='red'>
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
