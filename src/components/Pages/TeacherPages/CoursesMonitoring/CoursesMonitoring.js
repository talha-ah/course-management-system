import React, { Component } from 'react';

import classes from './CoursesMonitoring.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
// import TextArea from '../../../UI/TextArea/TextArea';
import Modal from '../../../UI/Modal/Modal';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class CoursesMonitoring extends Component {
  state = {
    pageLoading: true,
    modalLoading: true,
    selectCourseModal: true,
    isLoading: false,
    modalCourseId: '',
    modalCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseMonitoring: '',
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: ''
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
  }

  selectCourseModal = () => {
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
        `${process.env.REACT_APP_SERVER_URL}/teacher/getmonitoring/${courseId}`,
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
          console.log(resData);
          // this.setState({
          //   pageLoading: false,
          //   selectCourseModal: false,
          //   modalCourseId: courseId,
          //   modalCourseTitle: courseTitle,
          //   courseMonitoring: resData.courseMonitoring,
          //   isLoading: false
          // });
          // this.props.notify(true, 'Success', resData.message);
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
    this.setState({ [name]: value });
  };

  submitHandler = () => {
    const r1 = this.state.r1;
    const r2 = this.state.r2;
    const r3 = this.state.r3;
    const r4 = this.state.r4;
    const r5 = this.state.r5;
    console.log('1', r1, '2', r2, '3', r3, '4', r4, '5', r5);
    console.log('Form Submitted');
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesMonitoring}>
        <table className={classes.CoursesMonitoringTable}>
          <caption>
            Subject: <strong>{this.state.modalCourseTitle}</strong>
          </caption>
          <thead>
            <tr>
              <th>Criteria/Attribute</th>
              <th>Existing Process</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>How Far</td>
              <td></td>
            </tr>
            <tr>
              <td>Full Cover</td>
              <td></td>
            </tr>
            <tr>
              <td>Relevant Problems</td>
              <td></td>
            </tr>
            <tr>
              <td>Assess Standards</td>
              <td></td>
            </tr>
            <tr>
              <td>Emerge Application</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={this.submitHandler}>Submit Form</Button>
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

export default CoursesMonitoring;
