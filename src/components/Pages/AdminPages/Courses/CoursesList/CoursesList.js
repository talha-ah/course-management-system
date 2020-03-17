import React, { Component } from 'react';

import classes from './CoursesList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';
import Modal from '../../../../UI/Modal/Modal';

class CoursesList extends Component {
  state = {
    isLoading: false,
    pageLoading: true,
    courses: '',
    totalCourses: 0,
    disableModal: false,
    modalCourseId: '',
    modalCourseTitle: ''
  };

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/courses`, {
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
    this.setState({
      isLoading: true
    });
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/admin//deactivatecourse/${this.state.modalCourseId}`,
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
          isLoading: false,
          disableModal: false
        });
        this.fetchCourse();
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
  };

  addCoursePageHandler = () => {
    this.props.history.push('/addcourse');
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

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesList}>
        <table className={classes.CoursesListTable}>
          <caption>Course List</caption>
          <thead>
            <tr>
              <th colSpan='2'>Title</th>
              <th>Code</th>
              <th>Type</th>
              <th>Credits</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.courses.map(course => {
              return (
                <tr key={course._id}>
                  <td colSpan='2'>{course.title}</td>
                  <td>{course.code}</td>
                  <td>{course.type}</td>
                  <td>{course.credits}</td>
                  <td>{course.status}</td>
                  <td>
                    <TableButton
                      disabled={course.status === 'Active' ? '' : 'disabled'}
                      title='Disable Course'
                      color='#f83245'
                      onClick={() =>
                        this.disableModalHandler(course._id, course.title)
                      }
                    >
                      x
                    </TableButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='4'>Total courses</th>
              <th colSpan='3'>{this.state.totalCourses}</th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={this.addCoursePageHandler}>Add Course</Button>
        </div>
        {/* ===================================  Modal ===============================*/}
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
                <Button type='button' onClick={this.disableModalHandler}>
                  Cancel
                </Button>
                <Button
                  type='button'
                  buttonType='red'
                  onClick={this.onDisableCourse}
                >
                  Disable
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
    return page;
  }
}

export default CoursesList;
