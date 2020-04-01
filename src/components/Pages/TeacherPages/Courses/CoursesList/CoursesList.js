import React, { Component } from 'react';

import classes from './CoursesList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';
import Modal from '../../.././../UI/Modal/Modal';

class CoursesList extends Component {
  state = {
    pageLoading: true,
    courses: '',
    totalCourses: 0,
    disableModal: false,
    materialModal: false,
    modalCourseId: '',
    modalCourseTitle: ''
  };

  componentDidMount() {
    this.fetchFunction();
  }

  fetchFunction = () => {
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
        this.setState({
          courses: resData.courses,
          totalCourses: resData.totalCourses,
          pageLoading: false
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
  };

  onDisableCourse = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/teacher/disablecourse/${this.state.modalCourseId}`,
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
        this.setState({ disableModal: false });
        this.fetchFunction();
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

  disableModalHandler = (id, title) => {
    if (id && title) {
      this.setState(prevState => ({
        disableModal: !prevState.disableModal,
        modalCourseId: id,
        modalCourseTitle: title
      }));
    } else {
      this.setState(prevState => ({
        disableModal: !prevState.disableModal
      }));
    }
  };

  materialsModalHandler = (id, title) => {
    if (id && title) {
      this.setState(prevState => ({
        materialModal: !prevState.materialModal,
        modalCourseId: id,
        modalCourseTitle: title
      }));
    } else {
      this.setState(prevState => ({
        materialModal: !prevState.materialModal
      }));
    }
  };

  materialPageHandler = e => {
    if (e.target.name === 'assignment') {
      this.props.history.push({
        pathname: '/assignments',
        state: {
          courseId: this.state.modalCourseId,
          courseTitle: this.state.modalCourseTitle
        }
      });
    } else if (e.target.name === 'paper') {
      this.props.history.push({
        pathname: '/papers',
        state: {
          courseId: this.state.modalCourseId,
          courseTitle: this.state.modalCourseTitle
        }
      });
    } else if (e.target.name === 'quiz') {
      this.props.history.push({
        pathname: '/quizzes',
        state: {
          courseId: this.state.modalCourseId,
          courseTitle: this.state.modalCourseTitle
        }
      });
    }
  };

  addCoursePageHandler = () => {
    this.props.history.push('/takecourse');
  };

  onCourseFetch = id => {
    this.props.history.push(`/course/${id}`);
  };

  render() {
    var tableRow = (
      <tr>
        <td colSpan='6'>You don't have any courses.</td>
      </tr>
    );
    if (this.state.totalCourses > 0) {
      tableRow = this.state.courses.map(course => {
        return (
          <tr key={course._id}>
            <td
              colSpan='2'
              onClick={() => this.onCourseFetch(course._id)}
              className={classes.CourseTitle}
            >
              {course.title}
            </td>
            <td>{course.sections}</td>
            <td>{course.session}</td>
            <td>{course.status}</td>
            <td>
              <TableButton
                title='Add Materials'
                disabled={course.status === 'Active' ? '' : 'disabled'}
                onClick={() =>
                  this.materialsModalHandler(course._id, course.title)
                }
              >
                +
              </TableButton>
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
      });
    }

    var page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesList}>
        <table className={classes.CoursesListTable}>
          <caption>Course List</caption>
          <thead>
            <tr>
              <th colSpan='2'>Title</th>
              <th>Sections</th>
              <th>Session</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{tableRow}</tbody>
          <tfoot>
            <tr>
              <th colSpan='3'>Total courses</th>
              <th colSpan='3'>{this.state.totalCourses}</th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={this.addCoursePageHandler}>Add Course</Button>
        </div>
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
                    Deactivate <strong>{this.state.modalCourseTitle}?</strong>
                  </p>
                </div>
              </div>
              <div className={classes.buttonDiv}>
                <Button
                  type='button'
                  onClick={() => this.disableModalHandler()}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  onClick={this.onDisableCourse}
                  buttonType='red'
                >
                  Disable
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* ======================================= Disable Course Modal Ends  ====================================*/}
        {/* ======================================= Add Materials Modal Starts ====================================*/}
        <Modal visible={this.state.materialModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Materials</div>
                <div className={classes.ModalContentBody}>
                  What do you want to add to the course?
                </div>
              </div>
              <div className={classes.buttonDiv}>
                <Button
                  type='button'
                  name='quiz'
                  onClick={this.materialPageHandler}
                >
                  Quiz
                </Button>
                <Button
                  type='button'
                  name='assignment'
                  onClick={this.materialPageHandler}
                >
                  Assignment
                </Button>
                <Button
                  type='button'
                  name='paper'
                  onClick={this.materialPageHandler}
                >
                  Paper
                </Button>
              </div>
              <Button
                type='button'
                buttonType='red'
                onClick={() => this.materialsModalHandler()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        {/* ======================================= Add Materials Modal Ends    ===================================*/}
      </div>
    );
    return page;
  }
}

export default CoursesList;
