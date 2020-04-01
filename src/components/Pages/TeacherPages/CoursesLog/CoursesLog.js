import React, { Component } from 'react';

import classes from './CoursesLog.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import TableButton from '../../../UI/TableButton/TableButton';
import TableInput from '../../../UI/TableInput/TableInput';
import TextArea from '../../../UI/TextArea/TextArea';
import Modal from '../../../UI/Modal/Modal';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class CoursesLog extends Component {
  state = {
    pageLoading: true,
    modalLoading: true,
    selectCourseModal: true,
    isLoading: false,
    modalCourseId: '',
    modalCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseLog: '',
    addingRow: false,
    addLogLoading: false,
    date: '',
    duration: '01:30',
    topicsCovered: '',
    evaluationInstruments: ''
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/courses`, {
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
        resData.courses.map(course => {
          if (course.status === 'Active') {
            return arrayCourses.push(course.title);
          }
          return true;
        });
        this.setState({
          courses: resData.courses,
          coursesArray: arrayCourses,
          modalLoading: false
        });
      })
      .catch(err => {
        try {
          err.json().then(body => {
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

  setInstantDate = () => {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    var today = now.getFullYear() + '-' + month + '-' + day;
    this.setState({ date: today });
  };

  selectCourseModal = (id, title) => {
    this.setState(prevState => ({
      selectCourseModal: !prevState.selectCourseModal
    }));
  };

  onModalCancel = () => {
    if (this.state.modalCourseId !== '') {
      this.selectCourseModal();
    } else {
      this.props.history.push('/');
    }
  };

  onChangeCourse = e => {
    const title = e.target.value;
    this.setState({
      modalCourseTitle: title
    });
  };

  onSelectCourse = () => {
    this.setState({ isLoading: true });
    const courseTitle = this.state.modalCourseTitle;
    var courseId;

    this.state.courses.some(course => {
      if (course.title === courseTitle) {
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
            Authorization: 'Bearer ' + this.props.token
          }
        }
      )
        .then(res => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then(resData => {
          this.setState({
            pageLoading: false,
            selectCourseModal: false,
            modalCourseId: courseId,
            modalCourseTitle: courseTitle,
            courseLog: resData.courseLog,
            isLoading: false
          });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch(err => {
          try {
            err.json().then(body => {
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

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  insertRowHandler = () => {
    this.setState(prevState => ({ addingRow: !prevState.addingRow }));
  };

  addRowCancelHandler = () => {
    this.setState({ addingRow: false });
  };

  onLogAddHandler = () => {
    this.setState({ addLogLoading: true });

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/teacher/addcourselog/${this.state.courseLog._id}`,
      {
        method: 'POST',
        body: JSON.stringify({
          date: this.state.date,
          duration: this.state.duration,
          topics: this.state.topicsCovered,
          instruments: this.state.evaluationInstruments
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token
        }
      }
    )
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(resData => {
        this.setState({
          addLogLoading: false,
          addingRow: false
        });
        this.onSelectCourse();
        this.props.notify(true, 'Success', resData.message);
      })
      .catch(err => {
        try {
          err.json().then(body => {
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
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesLog}>
        <table className={classes.CoursesLogTable}>
          <caption>
            Subject: <strong>{this.state.modalCourseTitle}</strong>
          </caption>
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
            {this.state.courseLog.log.length > 0 ? (
              this.state.courseLog.log.map(row => {
                return (
                  <tr key={row._id} className={classes.CoursesLogTableRow}>
                    <td style={{ padding: '20px' }}>{row.date}</td>
                    <td style={{ padding: '20px' }}>{row.duration}</td>
                    <td>
                      <TextArea defaultValue={row.topics} />
                    </td>
                    <td style={{ padding: '20px' }}>{row.instruments}</td>
                    <td style={{ padding: '20px' }}>-</td>
                  </tr>
                );
              })
            ) : (
              <tr key={1} className={classes.CoursesLogTableRow}>
                <td style={{ padding: '20px' }} colSpan='5'>
                  You haven't added any courselog for this course yet!
                </td>
              </tr>
            )}
            {this.state.addingRow ? (
              <tr className={classes.AddRow}>
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
                    name='topicsCovered'
                    rows='2'
                    onChange={this.onChange}
                    value={this.state.topicsCovered}
                  />
                </td>
                <td>
                  <TableInput
                    type='text'
                    placeholder='Evaluation Instruments'
                    name='evaluationInstruments'
                    onChange={this.onChange}
                  />
                </td>
                <td>
                  <TableButton
                    title='Add'
                    className={classes.Button}
                    onClick={this.onLogAddHandler}
                    type='button'
                  >
                    +
                  </TableButton>
                  <TableButton
                    color='#ff9494'
                    title='Cancel'
                    className={classes.Button}
                    onClick={this.addRowCancelHandler}
                    type='button'
                  >
                    x
                  </TableButton>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className={classes.buttonDiv}>
          <Button
            onClick={this.insertRowHandler}
            disabled={this.state.addingRow ? true : false}
          >
            {this.state.addLogLoading ? 'Loading' : 'Add Log Row'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Modal Starts =================================*/}
        <Modal visible={this.state.selectCourseModal}>
          <div className={classes.Modal}>
            {this.state.modalLoading ? (
              <Spinner />
            ) : (
              <div className={classes.ModalBody}>
                <div className={classes.ModalContent}>
                  <div className={classes.ModalContentTitle}>
                    Select Course!
                  </div>
                  <SelectInput
                    name='courseTitle'
                    placeholder='Course List'
                    onChange={this.onChangeCourse}
                    disabled=''
                    defaultValue=''
                  >
                    {this.state.coursesArray}
                  </SelectInput>
                </div>
                <div className={classes.buttonDiv}>
                  <Button
                    type='button'
                    buttonType='red'
                    onClick={this.onModalCancel}
                  >
                    Cancel
                  </Button>
                  <Button type='button' onClick={this.onSelectCourse}>
                    {this.state.isLoading ? 'Loading' : 'Select'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
        {/* =======================================  Modal Ends  ====================================*/}
      </>
    );
  }
}

export default CoursesLog;
