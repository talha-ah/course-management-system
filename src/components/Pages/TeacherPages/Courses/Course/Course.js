import React, { Component } from 'react';

import classes from './Course.module.css';
import Modal from '../../../../UI/Modal/Modal';
import Spinner from '../../../../UI/Spinner/Spinner';
import Input from '../../../../UI/Input/Input';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';

class Course extends Component {
  state = {
    // Loadings
    pageLoading: true,
    uploadLoading: false,
    deleteLoading: false,
    completeLoading: false,
    // Modals
    deleteModal: false,
    completeModal: false,
    // Data
    _id: '',
    courseId: '',
    courseTitle: '',
    courseCode: '',
    courseType: '',
    courseStatus: '',
    courseSession: '',
    courseLog: '',
    courseDescriptions: '',
    courseMonitorings: '',
    courseAssignments: '',
    coursePapers: '',
    courseQuizzes: '',
    // Inputs
    courseSections: [],
    courseSectionsObject: {
      A: false,
      B: false,
      C: false,
      E1: false,
      E2: false,
    },
  };

  abortController = new AbortController();

  componentDidMount() {
    const courseId = this.props.match.params.courseId;
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/course/${courseId}`, {
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
        this.setState({
          _id: resData.course.course._id,
          courseId: resData.course.course.courseId,
          courseTitle: resData.course.course.title,
          courseCode: resData.course.course.code,
          courseType: resData.course.course.type,
          courseSections: resData.course.course.sections,
          courseSession: resData.course.course.session,
          courseStatus: resData.course.course.status,
          courseLog: resData.course.courseLog,
          courseDescriptions: resData.course.courseDescription,
          courseMonitorings: resData.course.courseMonitoring,
          courseAssignments: resData.course.assignments,
          coursePapers: resData.course.papers,
          courseQuizzes: resData.course.quizzes,
          pageLoading: false,
        });
        var secObjec = { ...this.state.courseSectionsObject };
        resData.course.course.sections.map((sec) => (secObjec[sec] = true));
        this.setState({ courseSectionsObject: secObjec });
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

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (e.target.type === 'checkbox') {
      this.setState((prevState) => ({
        ...prevState,
        courseSectionsObject: {
          ...prevState.courseSectionsObject,
          [name]: !prevState.courseSectionsObject[name],
        },
      }));
    } else {
      this.setState({ [name]: value });
    }
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    this.setState({ uploadLoading: true });
    const courseSections = [];

    Object.entries(this.state.courseSectionsObject).map((sec) =>
      sec[1] ? courseSections.push(sec[0]) : ''
    );

    if (courseSections.length > 0) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/editcourse`, {
        method: 'POST',
        body: JSON.stringify({
          courseId: this.state._id,
          sections: courseSections,
          session: this.state.courseSession,
        }),
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
          this.setState({ uploadLoading: false });
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
          } else {
            this.setState({ uploadLoading: false });
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
      this.setState({ uploadLoading: false });
      this.props.notify(true, 'Error', 'Select at least one section!');
    }
  };

  onDeleteHandler = () => {
    this.setState({ deleteLoading: true });

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/teacher/removecourse/${this.state._id}`,
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
        this.setState({ deleteModal: false, deleteLoading: false });
        this.props.history.push('/');
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
  };

  onCompleteHandler = () => {
    this.setState({ completeLoading: true });

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/teacher/completecourse/${this.state._id}`,
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
        this.setState({ completeModal: false, completeLoading: false });
        this.props.history.push('/');
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
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Course}>
        <div>
          <div className={classes.Caption}>
            <span className={classes.CaptionSpan}>
              Course: {this.state.courseTitle}
            </span>
          </div>
          <form
            className={classes.InfoForm}
            onSubmit={this.onFormSubmit}
            method='POST'
          >
            <div className={classes.InputDiv}>
              <label htmlFor='courseTitle'>Course Title</label>
              <Input
                type='text'
                name='courseTitle'
                placeholder='Course Title'
                value={this.state.courseTitle}
                onChange={this.onChange}
                disabled='disabled'
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='courseCode'>Course Code</label>
              <Input
                type='text'
                name='courseCode'
                placeholder='Course Code'
                value={this.state.courseCode}
                onChange={this.onChange}
                disabled='disabled'
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='courseType'>Course Type</label>
              <Input
                type='text'
                name='courseType'
                placeholder='Course Type'
                value={this.state.courseType}
                onChange={this.onChange}
                disabled='disabled'
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='courseSession'>Course Session</label>
              <Input
                type='text'
                name='courseSession'
                placeholder='Course Session'
                value={this.state.courseSession}
                onChange={this.onChange}
                disabled='disabled'
              />
            </div>

            <div className={classes.InputGroup}>
              <label htmlFor='courseSection'>Course Sections</label>
              <div className={classes.CheckBoxes} name='courseSection'>
                <div>
                  <input
                    type='checkbox'
                    value='A'
                    name='A'
                    id='A'
                    onChange={this.onChange}
                    disabled={
                      this.state.courseStatus === 'Active' ? false : true
                    }
                    checked={this.state.courseSectionsObject.A}
                  />
                  <label htmlFor='A'>A</label>
                </div>
                <div>
                  <input
                    type='checkbox'
                    value='B'
                    name='B'
                    id='B'
                    onChange={this.onChange}
                    disabled={
                      this.state.courseStatus === 'Active' ? false : true
                    }
                    checked={this.state.courseSectionsObject.B}
                  />
                  <label htmlFor='B'>B</label>
                </div>
                <div>
                  <input
                    type='checkbox'
                    value='C'
                    name='C'
                    id='C'
                    onChange={this.onChange}
                    disabled={
                      this.state.courseStatus === 'Active' ? false : true
                    }
                    checked={this.state.courseSectionsObject.C}
                  />
                  <label htmlFor='C'>C</label>
                </div>
                <div>
                  <input
                    type='checkbox'
                    value='E1'
                    name='E1'
                    id='E1'
                    onChange={this.onChange}
                    disabled={
                      this.state.courseStatus === 'Active' ? false : true
                    }
                    checked={this.state.courseSectionsObject.E1}
                  />
                  <label htmlFor='E1'>E1</label>
                </div>
                <div>
                  <input
                    type='checkbox'
                    value='E2'
                    name='E2'
                    id='E2'
                    onChange={this.onChange}
                    disabled={
                      this.state.courseStatus === 'Active' ? false : true
                    }
                    checked={this.state.courseSectionsObject.E2}
                  />
                  <label htmlFor='E2'>E2</label>
                </div>
              </div>
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                onClick={() => this.setState({ deleteModal: true })}
                buttonType='red'
                disabled={this.state.courseStatus === 'Complete' ? true : false}
              >
                Delete
              </Button>
              <Button
                type='button'
                onClick={() => this.setState({ completeModal: true })}
                buttonType='green'
                disabled={this.state.courseStatus === 'Complete' ? true : false}
              >
                Complete
              </Button>
              <Button
                type='submit'
                disabled={this.state.courseStatus === 'Active' ? false : true}
              >
                {this.state.uploadLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
        <hr />
        <div>
          <div className={classes.Caption}>
            <span className={classes.CaptionSpan}>Assignments</span>
          </div>
          <table className={classes.AssignmentsTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Marks</th>
                <th>Assessment</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.courseAssignments[0].assignments.length <= 0 ? (
                <tr key={1}>
                  <td colSpan='5'>
                    You haven't added any assignment for this course yet!
                  </td>
                </tr>
              ) : (
                this.state.courseAssignments[0].assignments.map((row) => {
                  return (
                    <tr key={row._id} className={classes.onRowHoverEffect}>
                      <td>
                        <strong>{row.title}</strong>
                      </td>
                      <td>{row.marks}</td>
                      <td>{row.assessment}</td>
                      <td>{row.section}</td>
                      <td>
                        <TableButton
                          disabled={
                            this.state.courseStatus === 'Active' ? false : true
                          }
                          onClick={() => {
                            this.props.history.push({
                              pathname: '/addresult',
                              state: {
                                pageFor: 'Assignment',
                                courseId: this.state.courseId,
                                courseTitle: this.state.courseTitle,
                                materialId: row._id,
                                materialTitle: row.title,
                                materialDoc: this.state.courseAssignments,
                              },
                            });
                          }}
                        >
                          {row.resultAdded ? 'Edit Result' : 'Add Result'}
                        </TableButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div className={classes.Caption}>
            <span className={classes.CaptionSpan}>Quizzes</span>
          </div>
          <table className={classes.QuizzesTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Marks</th>
                <th>Assessment</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.courseQuizzes[0].quizzes.length <= 0 ? (
                <tr key={1}>
                  <td colSpan='5'>
                    You haven't added any quiz for this course yet!
                  </td>
                </tr>
              ) : (
                this.state.courseQuizzes[0].quizzes.map((row) => {
                  return (
                    <tr key={row._id} className={classes.onRowHoverEffect}>
                      <td>
                        <strong>{row.title}</strong>
                      </td>
                      <td>{row.marks}</td>
                      <td>{row.assessment}</td>
                      <td>{row.section}</td>
                      <td>
                        <TableButton
                          disabled={
                            this.state.courseStatus === 'Active' ? false : true
                          }
                          onClick={() => {
                            this.props.history.push({
                              pathname: '/addresult',
                              state: {
                                pageFor: 'Quiz',
                                courseId: this.state.courseId,
                                courseTitle: this.state.courseTitle,
                                materialId: row._id,
                                materialTitle: row.title,
                                materialDoc: this.state.courseQuizzes,
                              },
                            });
                          }}
                        >
                          {row.resultAdded ? 'Edit Result' : 'Add Result'}
                        </TableButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div className={classes.Caption}>
            <span className={classes.CaptionSpan}>Papers</span>
          </div>
          <table className={classes.PapersTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Marks</th>
                <th>Assessment</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.coursePapers[0].papers.length <= 0 ? (
                <tr key={1}>
                  <td colSpan='5'>
                    You haven't added any paper for this course yet!
                  </td>
                </tr>
              ) : (
                this.state.coursePapers[0].papers.map((row) => {
                  return (
                    <tr key={row._id} className={classes.onRowHoverEffect}>
                      <td>
                        <strong>{row.title}</strong>
                      </td>
                      <td>{row.marks}</td>
                      <td>{row.assessment}</td>
                      <td>{row.section}</td>
                      <td>
                        <TableButton
                          disabled={
                            this.state.courseStatus === 'Active' ? false : true
                          }
                          onClick={() => {
                            this.props.history.push({
                              pathname: '/addresult',
                              state: {
                                pageFor: 'Paper',
                                courseId: this.state.courseId,
                                courseTitle: this.state.courseTitle,
                                materialId: row._id,
                                materialTitle: row.title,
                                materialDoc: this.state.coursePapers,
                              },
                            });
                          }}
                        >
                          {row.resultAdded ? 'Edit Result' : 'Add Result'}
                        </TableButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={classes.ButtonDiv}>
          <Button type='button' onClick={() => window.scrollTo(0, 0)}>
            Back to top
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Disable Course Modal Starts  =================================*/}
        <Modal visible={this.state.deleteModal || this.state.completeModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>
                  {this.state.completeModal ? 'Complete' : 'Delete'} Course!
                </div>
                <div className={classes.ModalContentBody}>
                  {this.state.completeModal ? (
                    <p>
                      Are you sure, you want to mark{' '}
                      <strong style={{ textDecoration: 'underline' }}>
                        {this.state.courseTitle}
                      </strong>{' '}
                      as completed?
                    </p>
                  ) : (
                    <p>
                      Are you sure, you want to delete{' '}
                      <strong style={{ textDecoration: 'underline' }}>
                        {this.state.courseTitle}
                      </strong>
                      ?
                    </p>
                  )}
                </div>
              </div>
              <div className={classes.ButtonDiv}>
                <Button
                  type='button'
                  buttonType={this.state.completeModal ? 'red' : ''}
                  onClick={() =>
                    this.setState({
                      deleteModal: false,
                      completeModal: false,
                      completeLoading: false,
                      deleteLoading: false,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  buttonType={this.state.completeModal ? 'green' : 'red'}
                  onClick={
                    this.state.completeModal
                      ? this.onCompleteHandler
                      : this.onDeleteHandler
                  }
                >
                  {this.state.completeModal
                    ? this.state.completeLoading
                      ? 'Loading...'
                      : 'Complete'
                    : this.state.deleteLoading
                    ? 'Deleting...'
                    : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* ======================================= Disable Course Modal Ends  ====================================*/}
      </>
    );
  }
}

export default Course;
