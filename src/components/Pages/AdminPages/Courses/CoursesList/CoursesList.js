import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import classes from './CoursesList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';
import Modal from '../../../../UI/Modal/Modal';

class CoursesList extends Component {
  state = {
    // Loadings
    pageLoading: true,
    contentLoading: false,
    disableModal: false,
    isLoading: false,
    // Data
    courses: '',
    totalCourses: 0,
    modalCourseId: '',
    modalCourseTitle: '',
  };

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse = () => {
    this.setState({ contentLoading: true });
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/courses`, {
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
        this.setState({ contentLoading: false });
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

  onDisableCourse = () => {
    this.setState({
      isLoading: true,
    });
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/admin/deactivatecourse/${this.state.modalCourseId}`,
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
          disableModal: false,
          isLoading: false,
        });
        this.fetchCourse();
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
  };

  addCoursePageHandler = () => {
    this.props.history.push('/addcourse');
  };

  disableModalHandler = (id, title) => {
    if (id && title) {
      this.setState((prevState) => ({
        disableModal: !prevState.disableModal,
        modalCourseId: id,
        modalCourseTitle: title,
      }));
    } else {
      this.setState((prevState) => ({
        disableModal: !prevState.disableModal,
      }));
    }
  };

  onCourseFetch = (id) => {
    this.props.history.push(`/course/${id}`);
  };

  render() {
    var activeCourses = 0;
    var inactiveCourses = 0;

    const page = this.state.pageLoading ? (
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
              <th>Credits</th>
              <th>Type</th>
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
                <td colSpan='7'>You don't have any courses.</td>
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
                      className={classes.CourseTitle}
                      onClick={this.onCourseFetch.bind(this, course._id)}
                    >
                      {course.title}
                    </td>
                    <td>{course.credits}</td>
                    <td>{course.type}</td>
                    <td>{course.session}</td>
                    <td>{course.status}</td>
                    <td>
                      <TableButton
                        title='Disable Course'
                        disabled={course.status === 'Active' ? '' : 'disabled'}
                        buttonType='red'
                        onClick={() =>
                          this.disableModalHandler(course._id, course.title)
                        }
                      >
                        <FontAwesomeIcon icon={faTrashAlt} size='sm' />
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
              <th colSpan='4'>
                {this.state.tab ? inactiveCourses : activeCourses}
              </th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.ButtonDiv}>
          <Button onClick={this.addCoursePageHandler}>Add Course</Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ===================================  Disable Course Modal Starts ===============================*/}
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
                    Deactivate <strong>{this.state.modalCourseTitle}?</strong>
                  </p>
                </div>
              </div>
              <div className={classes.ButtonDiv}>
                <Button type='button' onClick={this.disableModalHandler}>
                  Cancel
                </Button>
                <Button
                  type='button'
                  buttonType='red'
                  onClick={this.onDisableCourse}
                >
                  {this.state.isLoading ? 'Disabling' : 'Disable'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* ===================================  Disable Course Modal Ends ===============================*/}
      </>
    );
  }
}

export default CoursesList;
