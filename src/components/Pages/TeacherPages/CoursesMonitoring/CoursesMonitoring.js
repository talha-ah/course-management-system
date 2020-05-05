import React, { Component } from 'react';

import classes from './CoursesMonitoring.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import TextArea from '../../../UI/TextArea/TextArea';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class CoursesMonitoring extends Component {
  state = {
    // Loadings
    pageLoading: true,
    monitoringLoading: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseMonitoringId: '',
    status: 'new',
    // Inputs
    howFar: '',
    fullCover: '',
    relevantProblems: '',
    assessStandard: '',
    emergeApplication: '',
    // RederingObject
    data: {
      howFar: 'How far objectives have been achieved?',
      fullCover: 'Full Coverage of contents.',
      relevantProblems: 'Relevant Problem Skills Development',
      assessStandard: 'Assessment Standards',
      emergeApplication: 'Application of emerging technologies',
    },
  };

  abortController = new AbortController();

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/courses`, {
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectCourseTitle !== prevState.selectCourseTitle) {
      this.onSelectCourse();
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChangeCourse = (e) => {
    const title = e.target.value;
    if (title === 'Course List' || title === '') {
      this.setState({
        selectCourseId: '',
        selectCourseTitle: title,
      });
    } else {
      this.setState({
        selectCourseTitle: title,
      });
    }
  };

  onSelectCourse = () => {
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
      this.setState({ monitoringLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getmonitoring/${courseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.token,
          },
          signal: this.abortController.signal,
        }
      )
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({
            selectCourseId: courseId,
            courseMonitoringId: resData.courseMonitoring._id,
            howFar: resData.courseMonitoring.data.howFar,
            fullCover: resData.courseMonitoring.data.fullCover,
            relevantProblems: resData.courseMonitoring.data.relevantProblems,
            assessStandard: resData.courseMonitoring.data.assessStandard,
            emergeApplication: resData.courseMonitoring.data.emergeApplication,
            status: resData.courseMonitoring.status,
            monitoringLoading: false,
          });
        })
        .catch((err) => {
          this.setState({ monitoringLoading: false });
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
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          }
        });
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onMonitoringSubmit = (e) => {
    e.preventDefault();
    const howFar = this.state.howFar;
    const fullCover = this.state.fullCover;
    const relevantProblems = this.state.relevantProblems;
    const assessStandard = this.state.assessStandard;
    const emergeApplication = this.state.emergeApplication;
    const monitorId = this.state.courseMonitoringId;
    if (this.state.status === 'new') {
      if (
        howFar !== '' &&
        fullCover !== '' &&
        relevantProblems !== '' &&
        assessStandard !== '' &&
        emergeApplication !== ''
      ) {
        this.setState({ isLoading: true });
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/addmonitoring/${monitorId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({
              howFar: howFar,
              fullCover: fullCover,
              relevantProblems: relevantProblems,
              assessStandard: assessStandard,
              emergeApplication: emergeApplication,
            }),
            signal: this.abortController.signal,
          }
        )
          .then((res) => {
            if (!res.ok) throw res;
            return res.json();
          })
          .then((resData) => {
            this.props.history.push('/');
            this.props.notify(true, 'Success', resData.message);
          })
          .catch((err) => {
            this.setState({ isLoading: false });
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
                  err.message +
                    ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
                );
              }
            }
          });
      } else {
        this.props.notify(true, 'Error', 'Fields should not be empty!');
      }
    } else {
      this.props.notify(true, 'Error', 'You cannot edit it now!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesMonitoring}>
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
        {this.state.monitoringLoading ? (
          <Spinner />
        ) : this.state.selectCourseId === '' ? (
          <div className={classes.Centered}>Please select a course!</div>
        ) : (
          <form
            method='POST'
            onSubmit={this.onMonitoringSubmit}
            style={{ paddingTop: '25px' }}
          >
            {Object.entries(this.state.data).map((row) => {
              return (
                <div key={row[0]} className={classes.InputGroup}>
                  <label className={classes.Label}>{row[1]}</label>
                  <TextArea
                    rows='2'
                    onChange={this.onChange}
                    name={row[0]}
                    value={this.state[row[0]]}
                    style={{
                      height: '52px',
                      minHeight: '52px',
                      maxHeight: '180px',
                      padding: '2px 6px 2px 10px',
                    }}
                    disabled={this.state.status === 'new' ? false : true}
                  />
                </div>
              );
            })}
            <div className={classes.ButtonDiv}>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Submitting' : 'Submit Form'}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
    return page;
  }
}

export default CoursesMonitoring;
