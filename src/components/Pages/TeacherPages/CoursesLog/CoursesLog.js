import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import classes from './CoursesLog.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import TableButton from '../../../UI/TableButton/TableButton';
import TableInput from '../../../UI/TableInput/TableInput';
import TextArea from '../../../UI/TextArea/TextArea';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class CoursesLog extends Component {
  state = {
    // Loadings
    pageLoading: true,
    logLoading: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseLog: '',
    // Adding Log
    addingRow: false,
    date: '',
    duration: '01:30',
    topics: '',
    instruments: '',
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/courses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        const arrayCourses = [];
        resData.courses.map((course) => {
          if (course.status === 'Active') {
            return arrayCourses.push(course.title + '-' + course.session);
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
      });
    this.setInstantDate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectCourseTitle !== prevState.selectCourseTitle) {
      this.onSelectCourse();
    }
  }

  setInstantDate = () => {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    var today = now.getFullYear() + '-' + month + '-' + day;
    this.setState({ date: today });
  };

  onChangeCourse = (e) => {
    const title = e.target.value;
    if (title === 'Course List' || title === '') {
      this.setState({
        selectCourseId: '',
      });
    } else {
      this.setState({
        selectCourseTitle: title,
      });
    }
  };

  onSelectCourse = () => {
    this.setState({ logLoading: true });
    const courseTitle1 = this.state.selectCourseTitle;
    const courseTitle = courseTitle1.split('-')[0];
    const batch = courseTitle1.split('-')[1] + '-' + courseTitle1.split('-')[2];
    var courseId;

    this.state.courses.some((course) => {
      if (course.title === courseTitle && course.session === batch) {
        courseId = course._id;
        return true;
      }
      return false;
    });
    if (courseTitle !== '' && courseTitle !== 'Course List') {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getcourselog/${courseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({
            selectCourseId: courseId,
            courseLog: resData.courseLog,
            logLoading: false,
          });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
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
        });
    } else {
      this.props.notify(true, 'Error', 'Please select a course!');
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onLogAddHandler = (e) => {
    e.preventDefault();
    const topics = this.state.topics;
    const instruments = this.state.instruments;
    if (topics !== '' && instruments !== '') {
      this.setState({ isLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/addcourselog/${this.state.courseLog._id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            date: this.state.date,
            duration: this.state.duration,
            topics: topics,
            instruments: instruments,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.token,
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({
            isLoading: false,
            addingRow: false,
          });
          this.onSelectCourse();
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
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
        });
    } else {
      this.props.notify(true, 'Error', 'Field cannot be empty!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesLog}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            {this.state.selectCourseId === '' ? (
              ''
            ) : (
              <>
                Subject: &nbsp; <strong>{this.state.selectCourseTitle}</strong>
              </>
            )}
          </span>
          <span className={classes.CaptionSpan}>
            <SelectInput
              name='courseTitle'
              placeholder='Course List'
              onChange={this.onChangeCourse}
              disabled=''
              defaultValue=''
            >
              {this.state.coursesArray}
            </SelectInput>
          </span>
        </div>
        <table className={classes.CoursesLogTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration</th>
              <th>Topics Covered</th>
              <th>Evaluation Instruments</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {this.state.logLoading ? (
              <tr>
                <td colSpan='5'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.selectCourseId === '' ? (
              <tr key={1}>
                <td style={{ padding: '20px' }} colSpan='5'>
                  Please select a course!
                </td>
              </tr>
            ) : this.state.courseLog.log.length <= 0 ? (
              <tr key={1}>
                <td style={{ padding: '20px' }} colSpan='5'>
                  You haven't added any courselog for this course yet!
                </td>
              </tr>
            ) : (
              this.state.courseLog.log.map((row) => {
                return (
                  <tr key={row._id}>
                    <td>{row.date}</td>
                    <td>{row.duration}</td>
                    <td>
                      <TextArea
                        defaultValue={row.topics}
                        disabled={true}
                        rows='1'
                        style={{
                          height: '22px',
                          minHeight: '22px',
                          maxHeight: '66px',
                          border: '0',
                        }}
                      />
                    </td>
                    <td>{row.instruments}</td>
                    <td>-</td>
                  </tr>
                );
              })
            )}
            {this.state.addingRow ? (
              <tr>
                <td>
                  <TableInput
                    type='date'
                    name='date'
                    value={this.state.date}
                    onChange={this.onChange}
                  />
                </td>
                <td>
                  <TableInput
                    type='time'
                    name='duration'
                    value={this.state.duration}
                    onChange={this.onChange}
                  />
                </td>
                <td>
                  <TextArea
                    placeholder='Topics Covered'
                    name='topics'
                    rows='1'
                    onChange={this.onChange}
                    value={this.state.topics}
                    style={{
                      height: '22px',
                      minHeight: '22px',
                      maxHeight: '66px',
                      border: '0',
                      textAlign: 'center',
                    }}
                  />
                </td>
                <td>
                  <TableInput
                    type='text'
                    placeholder='Evaluation Instruments'
                    name='instruments'
                    onChange={this.onChange}
                    value={this.state.instruments}
                  />
                </td>
                <td>
                  <TableButton
                    title='Add'
                    className={classes.Button}
                    onClick={this.onLogAddHandler}
                    type='button'
                  >
                    <FontAwesomeIcon icon={faPlusSquare} size='sm' />
                  </TableButton>
                  <TableButton
                    style={{ marginLeft: '0.4em' }}
                    buttonType='red'
                    title='Cancel'
                    className={classes.Button}
                    onClick={() => this.setState({ addingRow: false })}
                    type='button'
                  >
                    <FontAwesomeIcon icon={faWindowClose} size='sm' />
                  </TableButton>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className={classes.ButtonDiv}>
          <Button
            onClick={() => this.setState({ addingRow: true })}
            disabled={
              this.state.addingRow ||
              this.state.selectCourseTitle === '' ||
              this.state.selectCourseTitle === 'Course List'
                ? true
                : false
            }
          >
            {this.state.isLoading ? 'Loading' : 'Add Log Row'}
          </Button>
        </div>
      </div>
    );
    return page;
  }
}

export default CoursesLog;
