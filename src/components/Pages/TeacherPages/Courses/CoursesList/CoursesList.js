import React, { Component } from 'react';

import classes from './CoursesList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Input from '../../../../UI/Input/Input';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';
import SelectInput from '../../../../UI/SelectInput/SelectInput';
import Modal from '../../.././../UI/Modal/Modal';

class CoursesList extends Component {
  state = {
    // Loadings
    pageLoading: true,
    contentLoading: false,
    disableModal: false,
    addCourseModal: false,
    isLoading: false,
    // Data
    adminCourses: '',
    adminCoursesArray: [],
    courses: '',
    totalCourses: 0,
    selectCourseId: '',
    selectCourseTitle: '',
    // Inputs
    courseTitle: '',
    courseSections: [],
    courseSession: '',
    A: false,
    B: false,
    C: false,
    E1: false,
    E2: false,
    // Tabs
    tab: false,
  };

  componentDidMount() {
    this.fetchTeacherCourses();
    this.fetchAdminCourses();
  }

  fetchTeacherCourses = () => {
    this.setState({ contentLoading: true });
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
        this.setState({
          courses: resData.courses,
          totalCourses: resData.totalCourses,
          pageLoading: false,
          contentLoading: false,
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
  };

  fetchAdminCourses = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/listcourses`, {
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
            return arrayCourses.push(course.title);
          }
          return true;
        });
        this.setState({
          adminCourses: resData.courses,
          adminCoursesArray: arrayCourses,
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
  };

  disableModalHandler = (id, title) => {
    if (id && title) {
      this.setState((prevState) => ({
        disableModal: !prevState.disableModal,
        selectCourseId: id,
        selectCourseTitle: title,
      }));
    } else {
      this.setState((prevState) => ({
        disableModal: !prevState.disableModal,
      }));
    }
  };

  onDisableCourse = () => {
    this.setState({ isLoading: true });

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/teacher/disablecourse/${this.state.selectCourseId}`,
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
        this.setState({ disableModal: false, isLoading: false });
        this.fetchTeacherCourses();
      })
      .catch((err) => {
        this.setState({ isLoading: false });
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
  };

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (e.target.type === 'checkbox') {
      this.setState({ [name]: e.target.checked });
    } else {
      this.setState({ [name]: value });
    }
  };

  onAddCourseFormSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const courseTitle = this.state.courseTitle;
    const courseSession = this.state.courseSession;
    const courseSections = this.state.courseSections;
    var courseId;

    this.state.adminCourses.some((course) => {
      if (course.title === courseTitle) {
        courseId = course._id;
        return true;
      }
      return false;
    });

    if (this.state.A) {
      courseSections.push('A');
    }
    if (this.state.B) {
      courseSections.push('B');
    }
    if (this.state.C) {
      courseSections.push('C');
    }
    if (this.state.E1) {
      courseSections.push('E1');
    }
    if (this.state.E2) {
      courseSections.push('E2');
    }

    if (
      courseTitle !== '' &&
      courseTitle !== 'Course List' &&
      courseSession !== '' &&
      courseSections.length > 0
    ) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/takecourse`, {
        method: 'POST',
        body: JSON.stringify({
          courseId: courseId,
          sections: this.state.courseSections,
          session: this.state.courseSession,
        }),
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
          this.setState({ addCourseModal: false, isLoading: false });
          this.props.notify(true, 'Success', resData.message);
          this.fetchTeacherCourses();
        })
        .catch((err) => {
          this.setState({ isLoading: false });
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
      this.setState({ isLoading: false });
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  onCourseFetch = (id) => {
    this.props.history.push(`/course/${id}`);
  };

  render() {
    var activeCourses = 0;
    var inactiveCourses = 0;

    var page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesList}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>Course List</span>
          <span className={classes.CaptionSpan}>
            Total Courses: {this.state.totalCourses}
          </span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: false })}
            style={{
              borderBottom: !this.state.tab ? '1px solid #3b3e66' : '',
            }}
          >
            Active Courses
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: true })}
            style={{
              borderBottom: this.state.tab ? '1px solid #3b3e66' : 'none',
            }}
          >
            Inactive Courses
          </div>
        </div>
        <table className={classes.CoursesListTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th colSpan='2'>Title</th>
              <th>Sections</th>
              <th>Session</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.contentLoading ? (
              <tr>
                <td colSpan='7'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.totalCourses <= 0 ? (
              <tr>
                <td colSpan='6'>You don't have any courses.</td>
              </tr>
            ) : (
              this.state.courses.map((course) => {
                if (this.state.tab) {
                  if (course.status === 'Active') {
                    return true;
                  } else {
                    inactiveCourses++;
                  }
                } else {
                  if (course.status === 'Inactive') {
                    return true;
                  } else {
                    activeCourses++;
                  }
                }
                return (
                  <tr key={course._id}>
                    <td>
                      <strong>{course.code}</strong>
                    </td>
                    <td
                      colSpan='2'
                      onClick={() => this.onCourseFetch(course._id)}
                      className={classes.CourseTitle}
                    >
                      {course.title}
                    </td>
                    <td>{course.sections.map((section) => section + ' ')}</td>
                    <td>{course.session}</td>
                    <td>{course.status}</td>
                    <td>
                      <TableButton
                        title='Disable Course'
                        disabled={course.status === 'Active' ? '' : 'disabled'}
                        color='#ff9494'
                        onClick={() =>
                          this.disableModalHandler(course._id, course.title)
                        }
                      >
                        x
                      </TableButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='4'>
                {this.state.tab ? 'Inactive Courses' : 'Active Courses'}
              </th>
              <th colSpan='3'>
                {this.state.tab ? inactiveCourses : activeCourses}
              </th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.ButtonDiv}>
          <Button onClick={() => this.setState({ addCourseModal: true })}>
            {this.state.addCourseModal ? 'Adding Course' : 'Add Course'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Disable Course Modal Starts  =================================*/}
        <Modal visible={this.state.disableModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>
                  Deactivate Course!
                </div>
                <div className={classes.ModalContentBody}>
                  <p>You won't be able to activate this course after this!</p>
                  <p>
                    Deactivate <strong>{this.state.selectCourseTitle}?</strong>
                  </p>
                </div>
              </div>
              <div className={classes.ButtonDiv}>
                <Button
                  type='button'
                  onClick={this.onDisableCourse}
                  buttonType='red'
                >
                  {this.state.isLoading ? 'Disabling' : 'Disable'}
                </Button>
                <Button
                  type='button'
                  onClick={() => this.disableModalHandler()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* ======================================= Disable Course Modal Ends  ====================================*/}
        {/* ======================================= Add Course Modal Starts  =================================*/}
        <Modal visible={this.state.addCourseModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Course</div>
                <form onSubmit={this.onAddCourseFormSubmit}>
                  <div className={classes.InputGroup}>
                    <label htmlFor='courseTitle'>Course Title</label>
                    <SelectInput
                      name='courseTitle'
                      placeholder='Course Title'
                      onChange={this.onChange}
                      disabled=''
                      defaultValue=''
                    >
                      {this.state.adminCoursesArray}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='courseSession'>Course Session</label>
                    <Input
                      type='text'
                      name='courseSession'
                      placeholder='Course Session'
                      value={this.state.courseSession}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='courseSection'>Course Section</label>
                    <div className={classes.CheckBoxes} name='courseSection'>
                      <div>
                        <input
                          type='checkbox'
                          value='A'
                          name='A'
                          onChange={this.onChange}
                        />
                        <label htmlFor='A'>A</label>
                      </div>
                      <div>
                        <input
                          type='checkbox'
                          value='B'
                          name='B'
                          onChange={this.onChange}
                        />
                        <label htmlFor='B'>B</label>
                      </div>
                      <div>
                        <input
                          type='checkbox'
                          value='C'
                          name='C'
                          onChange={this.onChange}
                        />
                        <label htmlFor='C'>C</label>
                      </div>
                      <div>
                        <input
                          type='checkbox'
                          value='E1'
                          name='E1'
                          onChange={this.onChange}
                        />
                        <label htmlFor='E1'>E1</label>
                      </div>
                      <div>
                        <input
                          type='checkbox'
                          value='E2'
                          name='E2'
                          onChange={this.onChange}
                        />
                        <label htmlFor='E2'>E2</label>
                      </div>
                    </div>
                  </div>

                  <div className={classes.ButtonDiv}>
                    <Button
                      type='button'
                      buttonType='red'
                      onClick={() =>
                        this.setState({
                          addCourseModal: false,
                          courseTitle: '',
                          courseSection: '',
                          courseSession: '',
                        })
                      }
                    >
                      Cancel
                    </Button>
                    <Button type='submit'>
                      {this.state.isLoading ? 'Loading' : 'Add Course'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
        {/* ======================================= Add Course Modal Ends  ====================================*/}
      </>
    );
  }
}

export default CoursesList;
