import React, { Component } from 'react';

import classes from './Papers.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class Papers extends Component {
  state = {
    pageLoading: true,
    modalLoading: false,
    selectCourseModal: false,
    isLoading: false,
    addPaperLoading: false,
    addPaperModal: false,
    modalCourseId: '',
    modalCourseTitle: '',
    courses: '',
    coursesArray: [],
    papers: '',
    title: '',
    grade: '',
    prePost: 'Mid-Term',
    paper: null,
    solution: null
  };

  componentDidMount() {
    if (this.props.history.location.state !== null) {
      const courseId = this.props.history.location.state.courseId;
      const courseTitle = this.props.history.location.state.courseTitle;

      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getpapers/${courseId}`,
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
            modalCourseId: courseId,
            modalCourseTitle: courseTitle,
            papers: resData.papers,
            pageLoading: false,
            selectCourseModal: false,
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
      this.setState({
        modalLoading: true,
        selectCourseModal: true
      });
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
  }

  selectCourseModal = () => {
    this.setState(prevState => ({
      selectCourseModal: !prevState.selectCourseModal
    }));
  };

  onSelectCourseModalCancel = () => {
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
        `${process.env.REACT_APP_SERVER_URL}/teacher/getpapers/${courseId}`,
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
            modalCourseId: courseId,
            modalCourseTitle: courseTitle,
            papers: resData.papers,
            pageLoading: false,
            selectCourseModal: false,
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

  // Adding paper

  onChange = e => {
    const name = e.target.name;
    if (e.target.files && e.target.files[0]) {
      this.setState({
        [name]: e.target.files[0]
      });
    } else {
      const value = e.target.value;
      this.setState({
        [name]: value
      });
    }
  };

  addPaperModalHandler = () => {
    this.setState(prevState => ({
      addPaperModal: !prevState.addPaperModal
    }));
  };

  onAddPaperHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (
      this.state.paper !== null &&
      this.state.solution !== null &&
      this.state.title !== '' &&
      this.state.grade !== ''
    ) {
      const title = this.state.title;
      const grade = this.state.grade;
      const prePost = this.state.prePost;
      const paper = this.state.paper;
      const solution = this.state.solution;

      if (paper.size < 5000000 && solution.size < 5000000) {
        if (
          (paper.type === 'application/pdf' ||
            paper.type === 'image/jpg' ||
            paper.type === 'image/png' ||
            paper.type === 'image/jpeg') &&
          (solution.type === 'application/pdf' ||
            solution.type === 'image/jpg' ||
            solution.type === 'image/png' ||
            solution.type === 'image/jpeg')
        ) {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('grade', grade);
          formData.append('prePost', prePost);
          formData.append('paper', paper);
          formData.append('solution', solution);

          fetch(
            `${process.env.REACT_APP_SERVER_URL}/teacher/addpaper/${this.state.papers._id}`,
            {
              method: 'POST',
              body: formData,
              headers: {
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
                papers: resData.papers,
                addPaperLoading: false,
                addPaperModal: false,
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
      <div className={classes.Papers}>
        <table className={classes.PapersTable}>
          <caption>
            Subject: <strong>{this.state.modalCourseTitle}</strong>
          </caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Grades</th>
              <th>Assessment</th>
              <th>Paper</th>
              <th>Solution</th>
            </tr>
          </thead>
          <tbody>
            {this.state.papers.papers.length > 0 ? (
              this.state.papers.papers.map(row => {
                return (
                  <tr key={row._id} className={classes.papersTableRow}>
                    <td style={{ padding: '20px' }}>{row.title}</td>
                    <td style={{ padding: '20px' }}>{row.grade}</td>
                    <td style={{ padding: '20px' }}>{row.assessment}</td>
                    <td>{row.paper.name}</td>
                    <td>{row.solution.name}</td>
                  </tr>
                );
              })
            ) : (
              <tr key={1} className={classes.papersTableRow}>
                <td style={{ padding: '20px' }} colSpan='5'>
                  You haven't added any paper for this course yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={classes.buttonDiv}>
          <Button
            onClick={this.addPaperModalHandler}
            disabled={this.state.addPaperLoading ? true : false}
          >
            {this.state.addPaperLoading ? 'Loading' : 'Add paper'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Select Course Modal Starts =================================*/}
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
                    onClick={this.onSelectCourseModalCancel}
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
        {/* =======================================  Select Course Modal Ends  ====================================*/}
        {/* ======================================= Add paper Modal Starts =================================*/}
        <Modal visible={this.state.addPaperModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Paper</div>
                <form onSubmit={this.onAddPaperHandler}>
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
                      max='60'
                      value={this.state.grade}
                      onChange={this.onChange}
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='prePost'>Time</label>
                    <SelectInput name='prePost' onChange={this.onChange}>
                      {['Mid-Term', 'Final-Term']}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='paper'>Paper</label>
                    <Input
                      type='file'
                      name='paper'
                      accept='image/*, application/pdf'
                      placeholder='paper'
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

                  <div className={classes.buttonDiv}>
                    <Button
                      type='button'
                      buttonType='red'
                      onClick={this.addPaperModalHandler}
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

export default Papers;
