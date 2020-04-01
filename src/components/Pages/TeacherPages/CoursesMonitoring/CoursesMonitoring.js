import React, { Component } from 'react';

import classes from './CoursesMonitoring.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import TextArea from '../../../UI/TextArea/TextArea';
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
    courseMonitoringId: '',
    howFar: '',
    fullCover: '',
    relevantProblems: '',
    assessStandard: '',
    emergeApplication: ''
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
          this.setState({
            pageLoading: false,
            selectCourseModal: false,
            modalCourseId: courseId,
            modalCourseTitle: courseTitle,
            courseMonitoringId: resData.courseMonitoring._id,
            howFar: resData.courseMonitoring.data.howFar,
            fullCover: resData.courseMonitoring.data.fullCover,
            relevantProblems: resData.courseMonitoring.data.relevantProblems,
            assessStandard: resData.courseMonitoring.data.assessStandard,
            emergeApplication: resData.courseMonitoring.data.emergeApplication,
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
    this.setState({ [name]: value });
  };

  submitHandler = e => {
    e.preventDefault();
    const howFar = this.state.howFar;
    const fullCover = this.state.fullCover;
    const relevantProblems = this.state.relevantProblems;
    const assessStandard = this.state.assessStandard;
    const emergeApplication = this.state.emergeApplication;
    const monitorId = this.state.courseMonitoringId;
    if (
      howFar !== '' &&
      fullCover !== '' &&
      relevantProblems !== '' &&
      assessStandard !== '' &&
      emergeApplication !== ''
    ) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/addmonitoring/${monitorId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.token
          },
          body: JSON.stringify({
            howFar: howFar,
            fullCover: fullCover,
            relevantProblems: relevantProblems,
            assessStandard: assessStandard,
            emergeApplication: emergeApplication
          })
        }
      )
        .then(res => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then(resData => {
          this.props.history.push('/');
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
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesMonitoring}>
        <div className={classes.Caption}>
          Course Monitoring: {this.state.courseTitle}
        </div>
        <form method='POST' onSubmit={this.submitHandler}>
          <div className={classes.InputGroup}>
            <label className={classes.Label}>
              How far objectives have been achieved?
            </label>
            <TextArea
              rows='6'
              onChange={this.onChange}
              name='howFar'
              value={this.state.howFar}
              style={{ minHeight: '132px', maxHeight: '200px' }}
            />
          </div>
          <div className={classes.InputGroup}>
            <label className={classes.Label}>Full Coverage of contents.</label>
            <TextArea
              rows='6'
              onChange={this.onChange}
              name='fullCover'
              value={this.state.fullCover}
              style={{ minHeight: '132px', maxHeight: '200px' }}
            />
          </div>
          <div className={classes.InputGroup}>
            <label className={classes.Label}>
              Relevant Problem Skills Development
            </label>
            <TextArea
              rows='6'
              onChange={this.onChange}
              name='relevantProblems'
              value={this.state.relevantProblems}
              style={{ minHeight: '132px', maxHeight: '200px' }}
            />
          </div>
          <div className={classes.InputGroup}>
            <label className={classes.Label}>Assessment Standards</label>
            <TextArea
              rows='6'
              onChange={this.onChange}
              name='assessStandard'
              value={this.state.assessStandard}
              style={{ minHeight: '132px', maxHeight: '200px' }}
            />
          </div>
          <div className={classes.InputGroup}>
            <label className={classes.Label}>
              Application of emerging technologies
            </label>
            <TextArea
              rows='6'
              onChange={this.onChange}
              name='emergeApplication'
              value={this.state.emergeApplication}
              style={{ minHeight: '132px', maxHeight: '200px' }}
            />
          </div>
          <div className={classes.buttonDiv}>
            <Button type='submit'>Submit Form</Button>
          </div>
        </form>
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
