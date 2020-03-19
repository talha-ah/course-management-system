import React, { Component } from 'react';

import classes from './Quizzes.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class Quizzes extends Component {
  state = {
    pageLoading: true,
    modalLoading: false,
    selectCourseModal: false,
    isLoading: false,
    addQuizzLoading: false,
    addQuizzModal: false,
    modalCourseId: '',
    modalCourseTitle: '',
    courses: '',
    coursesArray: [],
    quizzes: '',
    title: '',
    grade: '',
    prePost: 'Pre-Mid',
    quizz: null,
    solution: null
  };

  componentDidMount() {
    if (this.props.history.location.state !== null) {
      const courseId = this.props.history.location.state.courseId;
      const courseTitle = this.props.history.location.state.courseTitle;

      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getquizzes/${courseId}`,
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
            quizzes: resData.quizzes,
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
        `${process.env.REACT_APP_SERVER_URL}/teacher/getquizzes/${courseId}`,
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
            quizzes: resData.quizzes,
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

  // Adding Quizz

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

  addQuizzModalHandler = () => {
    this.setState(prevState => ({
      addQuizzModal: !prevState.addQuizzModal
    }));
  };

  onAddQuizzHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (
      this.state.quizz !== null &&
      this.state.solution !== null &&
      this.state.title !== '' &&
      this.state.grade !== ''
    ) {
      const title = this.state.title;
      const grade = this.state.grade;
      const prePost = this.state.prePost;
      const quizz = this.state.quizz;
      const solution = this.state.solution;

      if (quizz.size < 5000000 && solution.size < 5000000) {
        if (
          (quizz.type === 'application/pdf' ||
            quizz.type === 'image/jpg' ||
            quizz.type === 'image/png' ||
            quizz.type === 'image/jpeg') &&
          (solution.type === 'application/pdf' ||
            solution.type === 'image/jpg' ||
            solution.type === 'image/png' ||
            solution.type === 'image/jpeg')
        ) {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('grade', grade);
          formData.append('prePost', prePost);
          formData.append('quiz', quizz);
          formData.append('solution', solution);

          fetch(
            `${process.env.REACT_APP_SERVER_URL}/teacher/addquiz/${this.state.quizzes._id}`,
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
                quizzes: resData.quizzes,
                addQuizzLoading: false,
                addQuizzModal: false,
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
      <div className={classes.Quizzes}>
        <table className={classes.QuizzesTable}>
          <caption>
            Subject: <strong>{this.state.modalCourseTitle}</strong>
          </caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Grades</th>
              <th>Assessment</th>
              <th>Quiz</th>
              <th>Solution</th>
            </tr>
          </thead>
          <tbody>
            {this.state.quizzes.quizzes.length > 0 ? (
              this.state.quizzes.quizzes.map(row => {
                return (
                  <tr key={row._id} className={classes.QuizzesTableRow}>
                    <td style={{ padding: '20px' }}>{row.title}</td>
                    <td style={{ padding: '20px' }}>{row.grade}</td>
                    <td style={{ padding: '20px' }}>{row.assessment}</td>
                    <td>{row.quiz.name}</td>
                    <td>{row.solution.name}</td>
                  </tr>
                );
              })
            ) : (
              <tr key={1} className={classes.quizzesTableRow}>
                <td style={{ padding: '20px' }} colSpan='5'>
                  You haven't added any quiz for this course yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={classes.buttonDiv}>
          <Button
            onClick={this.addQuizzModalHandler}
            disabled={this.state.addQuizzLoading ? true : false}
          >
            {this.state.addQuizzLoading ? 'Loading' : 'Add Quizz'}
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
        {/* ======================================= Add Quizz Modal Starts =================================*/}
        <Modal visible={this.state.addQuizzModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Quizz</div>
                <form onSubmit={this.onAddQuizzHandler}>
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
                    <label htmlFor='quizz'>Quizz</label>
                    <Input
                      type='file'
                      name='quizz'
                      accept='image/*, application/pdf'
                      placeholder='Quizz'
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
                      onClick={this.addQuizzModalHandler}
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

export default Quizzes;
