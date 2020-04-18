import React, { Component } from 'react';

import classes from './Grading.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
// import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class Grading extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    contentLoading: false,
    assignmentGradeLoading: false,
    quizGradeLoading: false,
    // Tabs
    tab: '',
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseSections: [],
    assignments: '',
    quizzes: '',
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

  onSelectCourse = async () => {
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
      this.setState({ contentLoading: true });
      try {
        const AssignmentRes = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/getassignments/${courseId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            signal: this.abortController.signal,
          }
        );
        const QuizzRes = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/getquizzes/${courseId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            signal: this.abortController.signal,
          }
        );
        if (!AssignmentRes.ok) throw AssignmentRes;
        if (!QuizzRes.ok) throw QuizzRes;
        const AssignmentResData = await AssignmentRes.json();
        const QuizzResData = await QuizzRes.json();

        this.setState({
          selectCourseId: courseId,
          assignments: AssignmentResData.assignments,
          quizzes: QuizzResData.quizzes,
          courseSections: courseSelect.sections,
          tab: courseSelect.sections[0],
          contentLoading: false,
        });
      } catch (err) {
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
      }
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  submitForms = () => {
    var totalGrade = 0;
    var assignmentFormElements = document.getElementById('assignmentFormID')
      .elements;
    var quizFormElements = document.getElementById('quizFormID').elements;

    for (let i = 0; i < assignmentFormElements.length - 1; i++) {
      totalGrade += +assignmentFormElements[i].value;
    }
    for (let i = 0; i < quizFormElements.length - 1; i++) {
      totalGrade += +quizFormElements[i].value;
    }

    if (totalGrade === 20) {
      document.getElementById('quizFormButton').click();
      document.getElementById('assignmentFormButton').click();
    } else {
      this.props.notify(
        true,
        'Error',
        'Total grade should be equal to sessional grade(20%)'
      );
    }
  };

  assignmentSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    const data1 = {};
    const section = this.state.tab;
    var error = false;
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      if (value === '') {
        error = true;
      } else {
        data1[key] = value;
      }
    }
    data[section] = data1;
    if (!error) {
      try {
        this.setState({ assignmentGradeLoading: true });
        const AssignmentRes = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/addassignmentgrades/${this.state.assignments._id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({ data: data }),
            signal: this.abortController.signal,
          }
        );
        if (!AssignmentRes.ok) throw AssignmentRes;
        await AssignmentRes.json();
        this.setState({ assignmentGradeLoading: false });
      } catch (err) {
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
      }
    } else {
      this.props.notify(true, 'Error', 'All the fields are required!');
    }
  };

  quizSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    const data1 = {};
    const section = this.state.tab;
    var error = false;
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      if (value === '') {
        error = true;
      } else {
        data1[key] = value;
      }
    }
    data[section] = data1;
    if (!error) {
      try {
        this.setState({ quizGradeLoading: true });
        const QuizRes = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/addquizgrades/${this.state.quizzes._id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({ data: data }),
            signal: this.abortController.signal,
          }
        );
        if (!QuizRes.ok) throw QuizRes;
        await QuizRes.json();
        this.setState({ quizGradeLoading: false });
        this.props.notify(true, 'Success', 'Grading saved.');
      } catch (err) {
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
      }
    } else {
      this.props.notify(true, 'Error', 'All the fields are required!');
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Grading}>
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
        {this.state.selectCourseId === '' ? (
          ''
        ) : (
          <div className={classes.TabsButtons}>
            {this.state.courseSections.map((section) => (
              <div
                key={section}
                className={classes.Button}
                onClick={() => this.setState({ tab: section })}
                style={{
                  borderBottom:
                    this.state.tab === section ? '1px solid #3b3e66' : '',
                }}
              >
                {section}
              </div>
            ))}
          </div>
        )}
        {this.state.contentLoading ? (
          <Spinner />
        ) : (
          <>
            <div className={classes.Caption}>
              <span className={classes.CaptionSpan} style={{ margin: 'auto' }}>
                Assignments
              </span>
            </div>
            <form
              method='POST'
              onSubmit={this.assignmentSubmit}
              id='assignmentFormID'
            >
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Marks</th>
                    <th>
                      Grades <small>(%)</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectCourseId === '' ? (
                    <tr key={1}>
                      <td colSpan='3'>Please select a course!</td>
                    </tr>
                  ) : this.state.assignments.assignments.length <= 0 ? (
                    <tr key={1}>
                      <td colSpan='3'>
                        You haven't added any assignment for this course yet!
                      </td>
                    </tr>
                  ) : (
                    this.state.assignments.assignments.map((row) => {
                      if (row.section === this.state.tab) {
                        var defValue = '';
                        if (this.state.assignments.grades[this.state.tab]) {
                          Object.entries(
                            this.state.assignments.grades[this.state.tab]
                          ).map((grd) => {
                            if (row._id === grd[0]) {
                              return (defValue = grd[1]);
                            }
                            return true;
                          });
                        }
                        return (
                          <tr key={row._id}>
                            <td>
                              {row.title} - {row.section}
                            </td>
                            <td>{row.marks}</td>
                            <td className={classes.InputTD}>
                              <input
                                className={classes.MarksInput}
                                type='number'
                                name={row._id}
                                onChange={this.onChange}
                                defaultValue={defValue}
                              />
                            </td>
                          </tr>
                        );
                      } else {
                        return true;
                      }
                    })
                  )}
                </tbody>
              </table>
              <button
                type='submit'
                style={{ display: 'none' }}
                id='assignmentFormButton'
              />
            </form>
            <div className={classes.Caption}>
              <span className={classes.CaptionSpan} style={{ margin: 'auto' }}>
                Quizzes
              </span>
            </div>
            <form method='POST' onSubmit={this.quizSubmit} id='quizFormID'>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Marks</th>
                    <th>
                      Grades <small>(%)</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectCourseId === '' ? (
                    <tr key={1}>
                      <td colSpan='3'>Please select a course!</td>
                    </tr>
                  ) : this.state.quizzes.quizzes.length <= 0 ? (
                    <tr key={1}>
                      <td colSpan='3'>
                        You haven't added any quizzes for this course yet!
                      </td>
                    </tr>
                  ) : (
                    this.state.quizzes.quizzes.map((row) => {
                      if (row.section === this.state.tab) {
                        var defValue = '';
                        if (this.state.quizzes.grades[this.state.tab]) {
                          Object.entries(
                            this.state.quizzes.grades[this.state.tab]
                          ).map((grd) => {
                            if (row._id === grd[0]) {
                              return (defValue = grd[1]);
                            }
                            return true;
                          });
                        }
                        return (
                          <tr key={row._id}>
                            <td>
                              {row.title} - {row.section}
                            </td>
                            <td>{row.marks}</td>
                            <td className={classes.InputTD}>
                              <input
                                className={classes.MarksInput}
                                type='number'
                                name={row._id}
                                onChange={this.onChange}
                                defaultValue={defValue}
                              />
                            </td>
                          </tr>
                        );
                      } else {
                        return true;
                      }
                    })
                  )}
                </tbody>
              </table>
              <button
                type='submit'
                style={{ display: 'none' }}
                id='quizFormButton'
              />
            </form>
            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                onClick={this.submitForms}
                disabled={
                  this.state.isLoading ||
                  this.state.selectCourseId === '' ||
                  this.state.assignmentGradeLoading ||
                  this.state.quizGradeLoading
                    ? true
                    : false
                }
              >
                {this.state.assignmentGradeLoading ||
                this.state.quizGradeLoading
                  ? 'Submitting...'
                  : 'Add Grades'}
              </Button>
            </div>
          </>
        )}
      </div>
    );
    return page;
  }
}

export default Grading;
