import React, { Component } from 'react';

import classes from './Quizzes.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import TableButton from '../../../UI/TableButton/TableButton';
import Modal from '../../../UI/Modal/Modal';

class Quizzes extends Component {
  state = {
    // Loadings
    pageLoading: true,
    quizLoading: false,
    addQuizzModal: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    quizzes: '',
    // Input
    title: '',
    grade: '',
    prePost: 'Pre-Mid',
    quizz: null,
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
            return arrayCourses.push(course.title);
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
    this.setState({ quizLoading: true });
    const courseTitle = this.state.selectCourseTitle;
    var courseId;

    this.state.courses.some((course) => {
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
            quizzes: resData.quizzes,
            quizLoading: false,
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

  // Adding Quizz

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

  addQuizzModalHandler = () => {
    this.setState((prevState) => ({
      addQuizzModal: !prevState.addQuizzModal,
    }));
  };

  onAddQuizzHandler = (e) => {
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
                quizzes: resData.quizzes,
                addQuizzModal: false,
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
      <div className={classes.Quizzes}>
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
        <table className={classes.QuizzesTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Grades</th>
              <th>Assessment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.quizLoading ? (
              <tr>
                <td colSpan='5'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.selectCourseId === '' ? (
              <tr key={1}>
                <td colSpan='5'>Please select a course!</td>
              </tr>
            ) : this.state.quizzes.quizzes.length <= 0 ? (
              <tr key={1}>
                <td colSpan='5'>
                  You haven't added any quiz for this course yet!
                </td>
              </tr>
            ) : (
              this.state.quizzes.quizzes.map((row) => {
                return (
                  <tr key={row._id}>
                    <td>{row.title}</td>
                    <td>{row.grade}</td>
                    <td>{row.assessment}</td>
                    <td>Status</td>
                    <td>
                      <TableButton
                        title='Add Result'
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/addresult',
                            state: {
                              pageFor: 'Quiz',
                              courseId: this.state.selectCourseId,
                              courseTitle: this.state.selectCourseTitle,
                              materialId: row._id,
                              materialTitle: row.title,
                              materialDoc: this.state.quizzes,
                            },
                          });
                        }}
                      >
                        +
                      </TableButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className={classes.ButtonDiv}>
          <Button buttonType='red' onClick={() => this.props.history.goBack()}>
            Go back
          </Button>
          <Button
            onClick={this.addQuizzModalHandler}
            disabled={
              this.state.isLoading ||
              this.state.selectCourseId === '' ||
              this.state.quizLoading
                ? true
                : false
            }
          >
            {this.state.isLoading ? 'Loading' : 'Add Quizz'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
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

                  <div className={classes.ButtonDiv}>
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
