import React, { Component } from 'react';

import classes from './Papers.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import Input from '../../../UI/Input/Input';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import TableButton from '../../../UI/TableButton/TableButton';
import Modal from '../../../UI/Modal/Modal';

class Papers extends Component {
  state = {
    // Loadings
    pageLoading: true,
    paperLoading: false,
    addPaperModal: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    sections: [],
    session: '',
    papers: '',
    // Input
    title: '',
    marks: '',
    prePost: 'Mid-Term',
    selectSection: '',
    paper: null,
    solution: null,
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
      this.setState({ paperLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getpapers/${courseId}`,
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
            papers: resData.papers,
            sections: courseSelect.sections,
            session: courseSelect.session,
            paperLoading: false,
          });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
          } else {
            this.setState({ paperLoading: false });
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

  // Adding paper

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

  onAddPaperHandler = (e) => {
    e.preventDefault();
    const data = {};

    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    if (
      data.paper !== null &&
      data.solution !== null &&
      data.title !== '' &&
      data.marks !== '' &&
      data.selectSection !== '' &&
      data.selectSection !== 'Section'
    ) {
      if (data.paper.size < 5000000 && data.solution.size < 5000000) {
        if (
          (data.paper.type === 'application/pdf' ||
            data.paper.type === 'image/jpg' ||
            data.paper.type === 'image/png' ||
            data.paper.type === 'image/jpeg') &&
          (data.solution.type === 'application/pdf' ||
            data.solution.type === 'image/jpg' ||
            data.solution.type === 'image/png' ||
            data.solution.type === 'image/jpeg')
        ) {
          const formData1 = new FormData();
          formData1.append('title', data.title);
          formData1.append('marks', data.marks);
          formData1.append('section', data.selectSection);
          formData1.append('batch', this.state.session);
          formData1.append('prePost', data.prePost);
          formData1.append('paper', data.paper);
          formData1.append('solution', data.solution);

          this.setState({ isLoading: true });

          fetch(
            `${process.env.REACT_APP_SERVER_URL}/teacher/addpaper/${this.state.papers._id}`,
            {
              method: 'POST',
              body: formData1,
              headers: {
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
                papers: resData.papers,
                addPaperModal: false,
                isLoading: false,
              });
              document.getElementById('addPaperForm').reset();
              this.props.notify(true, 'Success', resData.message);
            })
            .catch((err) => {
              if (err.name === 'AbortError') {
              } else {
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
                    err.message +
                      ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
                  );
                }
              }
            });
        } else {
          this.props.notify(
            true,
            'Error',
            'Only .pdf,.png,jpg,jpeg files are allowed.'
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
            >
              {this.state.coursesArray}
            </SelectInput>
          </span>
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
            {this.state.paperLoading ? (
              <tr>
                <td colSpan='5'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.selectCourseId === '' ? (
              <tr key={1}>
                <td colSpan='5'>Please select a course!</td>
              </tr>
            ) : this.state.papers.papers.length <= 0 ? (
              <tr key={1}>
                <td colSpan='5'>
                  You haven't added any paper for this course yet!
                </td>
              </tr>
            ) : (
              this.state.papers.papers.map((row) => {
                return (
                  <tr key={row._id}>
                    <td>{row.title}</td>
                    <td>{row.marks}</td>
                    <td>{row.assessment}</td>
                    <td>{row.section}</td>
                    <td>
                      <TableButton
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/addresult',
                            state: {
                              pageFor: 'Paper',
                              courseId: this.state.selectCourseId,
                              courseTitle: this.state.selectCourseTitle,
                              materialId: row._id,
                              materialTitle: row.title + '::' + row.section,
                              materialDoc: this.state.papers,
                              session: this.state.session,
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
        <div className={classes.ButtonDiv}>
          <Button
            onClick={() => this.setState({ addPaperModal: true })}
            disabled={
              this.state.isLoading ||
              this.state.selectCourseId === '' ||
              this.state.paperLoading
                ? true
                : false
            }
          >
            {this.state.isLoading ? 'Loading' : 'Add Paper'}
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {page}
        {/* ======================================= Add paper Modal Starts =================================*/}
        <Modal visible={this.state.addPaperModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>Add Paper</div>
                <form onSubmit={this.onAddPaperHandler} id='addPaperForm'>
                  <div className={classes.InputGroup}>
                    <label htmlFor='title'>Title</label>
                    <Input type='text' name='title' placeholder='Title'></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='marks'>Marks</label>
                    <Input
                      type='number'
                      name='marks'
                      placeholder='marks'
                      max='60'
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='prePost'>Time</label>
                    <SelectInput name='prePost'>
                      {['Mid-Term', 'Final-Term']}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='selectSection'>Section</label>
                    <SelectInput name='selectSection'>
                      {this.state.sections ? this.state.sections : []}
                    </SelectInput>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='paper'>Paper</label>
                    <Input
                      type='file'
                      name='paper'
                      placeholder='paper'
                      accept='image/*, application/pdf'
                    ></Input>
                  </div>
                  <div className={classes.InputGroup}>
                    <label htmlFor='solution'>Solution</label>
                    <Input
                      type='file'
                      name='solution'
                      placeholder='Solution'
                      accept='image/*, application/pdf'
                    ></Input>
                  </div>

                  <div className={classes.ButtonDiv}>
                    <Button
                      type='button'
                      buttonType='red'
                      onClick={() => {
                        this.setState({
                          addPaperModal: false,
                          isLoading: false,
                        });
                        document.getElementById('addPaperForm').reset();
                      }}
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
