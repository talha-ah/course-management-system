import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';

import classes from './Assignments.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import TableButton from '../../../UI/TableButton/TableButton';
import Modal from '../../../UI/Modal/Modal';

class Assignments extends Component {
  state = {
    // Loadings
    pageLoading: true,
    assignmentLoading: false,
    addAssignmentModal: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    sections: [],
    session: '',
    assignments: '',
    // Input
    title: '',
    grade: '',
    prePost: 'Pre-Mid',
    selectSection: '',
    assignment: null,
    solution: null,
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectCourseTitle !== prevState.selectCourseTitle) {
      this.onSelectCourse();
    }
  }

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
    this.setState({ assignmentLoading: true });
    const courseTitle1 = this.state.selectCourseTitle;
    const courseTitle = courseTitle1.split('-')[0];
    const batch = courseTitle1.split('-')[1] + '-' + courseTitle1.split('-')[2];
    var courseId;
    var courseSelect;

    this.state.courses.some((course) => {
      if (course.title === courseTitle && course.session === batch) {
        courseId = course._id;
        courseSelect = course;
        return true;
      }
      return false;
    });

    if (courseTitle !== '' && courseTitle !== 'Course List') {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getassignments/${courseId}`,
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
            assignments: resData.assignments,
            sections: courseSelect.sections,
            session: courseSelect.session,
            assignmentLoading: false,
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

  // Adding Assignment

  onChange = (e) => {
    const name = e.target.name;
    if (e.target.files && e.target.files[0]) {
      this.setState({
        [name]: e.target.files[0],
      });
    } else {
      const value = e.target.value;
      this.setState({
        [name]: value,
      });
    }
  };

  addAssignmentModalHandler = () => {
    this.setState((prevState) => ({
      addAssignmentModal: !prevState.addAssignmentModal,
    }));
  };

  onAddAssignmentHandler = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (
      this.state.assignment !== null &&
      this.state.solution !== null &&
      this.state.title !== '' &&
      this.state.grade !== '' &&
      this.state.selectSection !== '' &&
      this.state.selectSection !== 'Section'
    ) {
      const title = this.state.title;
      const grade = this.state.grade;
      const prePost = this.state.prePost;
      const assignment = this.state.assignment;
      const solution = this.state.solution;
      const section = this.state.selectSection;

      if (assignment.size < 5000000 && solution.size < 5000000) {
        if (
          (assignment.type === 'application/pdf' ||
            assignment.type === 'image/jpg' ||
            assignment.type === 'image/png' ||
            assignment.type === 'image/jpeg') &&
          (solution.type === 'application/pdf' ||
            solution.type === 'image/jpg' ||
            solution.type === 'image/png' ||
            solution.type === 'image/jpeg')
        ) {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('grade', grade);
          formData.append('section', section);
          formData.append('batch', this.state.session);
          formData.append('prePost', prePost);
          formData.append('assignment', assignment);
          formData.append('solution', solution);

          fetch(
            `${process.env.REACT_APP_SERVER_URL}/teacher/addassignment/${this.state.assignments._id}`,
            {
              method: 'POST',
              body: formData,
              headers: {
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
                assignments: resData.assignments,
                title: '',
                grade: '',
                prePost: 'Pre-Mid',
                assignment: null,
                solution: null,
                addAssignmentModal: false,
                isLoading: false,
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
                  err.message +
                    ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
                );
              }
            });
        } else {
          this.props.notify(
            true,
            'Error',
            'Only .pdf,.png,jpg,jpeg files are prohibited.'
          );
        }
      } else {
        this.props.notify(true, 'Error', 'Only file less than 5mb.');
      }
    } else {
      this.props.notify(true, 'Error', 'All fields are required.');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Assignments}>
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
        <table className={classes.AssignmentsTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Grades</th>
              <th>Assessment</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.assignmentLoading ? (
              <tr>
                <td colSpan='5'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.selectCourseId === '' ? (
              <tr key={1}>
                <td colSpan='5'>Please select a course!</td>
              </tr>
            ) : this.state.assignments.assignments.length <= 0 ? (
              <tr key={1}>
                <td colSpan='5'>
                  You haven't added any assignment for this course yet!
                </td>
              </tr>
            ) : (
              this.state.assignments.assignments.map((row) => {
                return (
                  <tr key={row._id}>
                    <td>{row.title}</td>
                    <td>{row.grade}</td>
                    <td>{row.assessment}</td>
                    <td>{row.section}</td>
                    <td>
                      <TableButton
                        title='Add Result'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/addresult',
                            state: {
                              pageFor: 'Assignment',
                              courseId: this.state.selectCourseId,
                              courseTitle: this.state.selectCourseTitle,
                              materialId: row._id,
                              materialTitle: row.title,
                              materialDoc: this.state.assignments,
                              session: this.state.session,
                            },
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faTable} size='sm' />
                      </TableButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className={classes.ButtonDiv}>
          <Button
            onClick={this.addAssignmentModalHandler}
            disabled={
              this.state.isLoading ||
              this.state.selectCourseId === '' ||
              this.state.assignmentLoading
                ? true
                : false
            }
          >
            {this.state.isLoading ? 'Loading' : 'Add Assignment'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Add Assignment Modal Starts =================================*/}
        <Modal visible={this.state.addAssignmentModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Assignment</div>
                <form onSubmit={this.onAddAssignmentHandler}>
                  <div className={classes.InputGroup}>
                    <label htmlFor='title'>Title</label>
                    <Input
                      type='text'
                      name='title'
                      placeholder='Title'
                      value={this.state.title}
                      onChange={this.onChange}
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='grade'>Grade</label>
                    <Input
                      type='number'
                      name='grade'
                      placeholder='Grade'
                      max='20'
                      value={this.state.grade}
                      onChange={this.onChange}
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='prePost'>Time</label>
                    <SelectInput name='prePost' onChange={this.onChange}>
                      {['Pre-Mid', 'Post-Mid']}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='selectSection'>Section</label>
                    <SelectInput
                      name='selectSection'
                      placeholder='Section'
                      onChange={this.onChange}
                      disabled=''
                      defaultValue=''
                    >
                      {this.state.sections ? this.state.sections : []}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='assignment'>Assignment</label>
                    <Input
                      type='file'
                      name='assignment'
                      accept='image/*, application/pdf'
                      placeholder='Assignment'
                      onChange={this.onChange}
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='solution'>Solution</label>
                    <Input
                      type='file'
                      name='solution'
                      accept='image/*, application/pdf'
                      placeholder='Solution'
                      onChange={this.onChange}
                    ></Input>
                  </div>

                  <div className={classes.ButtonDiv}>
                    <Button
                      type='button'
                      buttonType='red'
                      onClick={this.addAssignmentModalHandler}
                    >
                      Cancel
                    </Button>
                    <Button type='submit'>
                      {this.state.isLoading ? 'Loading' : 'Create'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
        {/* =======================================  Modal Ends  ====================================*/}
      </>
    );
  }
}

export default Assignments;
