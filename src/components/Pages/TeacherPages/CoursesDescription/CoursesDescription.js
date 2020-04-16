import React, { Component } from 'react';

import classes from './CoursesDescription.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import TextArea from '../../../UI/TextArea/TextArea';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class CoursesDescription extends Component {
  state = {
    // Loadings
    pageLoading: true,
    descriptionLoading: false,
    isLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: '',
    courses: '',
    coursesArray: [],
    courseDescriptionId: '',
    // Status
    status: 'new',
    phase: false,
    // Inputs
    prerequisites: '',
    assignments: '',
    quizzes: '',
    midTerm: '',
    finalTerm: '',
    coordinator: '',
    url: '',
    catalog: '',
    textbook: '',
    reference: '',
    goals: '',
    topicsCovered: '',
    laboratory: '',
    programming: '',
    theory: '',
    problem: '',
    solution: '',
    social: '',
    oralWritten: '',
    // RenderingObject
    data: {
      phase1: {
        prerequisites: 'Prerequisites by Course(s) and Topics',
        assessment:
          'Assessment Instruments with Weight (homework, quizzes, midterms, final, programming assignments, lab work, etc in %)',
        coordinator: 'Course Coordinator',
        url: 'URL (if any)',
        catalog: 'Current Catalog',
        textbook: 'Textbook (or Laboratory Manual for Laboratory Courses)',
        reference: 'Reference Material',
        goals: 'Course Goals',
      },
      phase2: {
        topicsCovered:
          'Topic Covered in the Course, with Number of Lectures on Each Topic (assume 15-week instruction and one-hour lectures)',
        laboratory: 'Laboratory Projects/Experiments Done in the Course',
        programming: 'Programming Assignments Done in the Course',
        classTime: 'Class Time Spent on (in credit hourse)',
        oralWritten: 'Oral and Written Communications',
      },
    },
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

    this.state.courses.some((course) => {
      if (course.title === courseTitle && course.session === batch) {
        courseId = course._id;
        return true;
      }
      return false;
    });

    if (courseTitle !== '' && courseTitle !== 'Course List') {
      this.setState({ descriptionLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/getdescription/${courseId}`,
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
            courseDescriptionId: resData.courseDescription._id,
            status: resData.courseDescription.status,
            prerequisites: resData.courseDescription.data.prerequisites,
            assignments: resData.courseDescription.data.assessment.assignments,
            quizzes: resData.courseDescription.data.assessment.quizzes,
            midTerm: resData.courseDescription.data.assessment.mid,
            finalTerm: resData.courseDescription.data.assessment.final,
            coordinator: resData.courseDescription.data.coordinator,
            url: resData.courseDescription.data.url,
            catalog: resData.courseDescription.data.catalog,
            textbook: resData.courseDescription.data.textbook,
            reference: resData.courseDescription.data.reference,
            goals: resData.courseDescription.data.goals,
            topicsCovered: resData.courseDescription.data.topicsCovered,
            laboratory: resData.courseDescription.data.laboratory,
            programming: resData.courseDescription.data.programming,
            theory: resData.courseDescription.data.classTime.theory,
            problem: resData.courseDescription.data.classTime.problemAnalysis,
            solution: resData.courseDescription.data.classTime.solutionDesign,
            social:
              resData.courseDescription.data.classTime.socialAndEthicalIssues,
            oralWritten: resData.courseDescription.data.oralWritten,
            descriptionLoading: false,
          });
          this.props.notify(true, 'Success', resData.message);
        })
        .catch((err) => {
          this.setState({ descriptionLoading: false });
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
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          }
        });
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  submitPhase1Handler = (e) => {
    e.preventDefault();
    if (this.state.status === 'new') {
      const descriptionId = this.state.courseDescriptionId;
      const prerequisites = this.state.prerequisites;
      const assignments = this.state.assignments;
      const quizzes = this.state.quizzes;
      const midTerm = this.state.midTerm;
      const finalTerm = this.state.finalTerm;
      const coordinator = this.state.coordinator;
      const url = this.state.url;
      const catalog = this.state.catalog;
      const textbook = this.state.textbook;
      const reference = this.state.reference;
      const goals = this.state.goals;

      if (
        prerequisites !== '' &&
        assignments !== '' &&
        quizzes !== '' &&
        midTerm !== '' &&
        finalTerm !== '' &&
        coordinator !== '' &&
        catalog !== '' &&
        textbook !== '' &&
        reference !== '' &&
        goals !== ''
      ) {
        this.setState({ isLoading: true });
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/adddescription/${descriptionId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({
              phase: 'phase1',
              prerequisites: prerequisites,
              assignments: assignments,
              quizzes: quizzes,
              midTerm: midTerm,
              finalTerm: finalTerm,
              coordinator: coordinator,
              url: url,
              catalog: catalog,
              textbook: textbook,
              reference: reference,
              goals: goals,
            }),
            signal: this.abortController.signal,
          }
        )
          .then((res) => {
            if (!res.ok) throw res;
            return res.json();
          })
          .then((resData) => {
            this.props.history.push('/');
            this.props.notify(true, 'Success', resData.message);
          })
          .catch((err) => {
            this.setState({ isLoading: false });
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
                  err.message +
                    ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
                );
              }
            }
          });
      } else {
        this.setState({ isLoading: false });
        this.props.notify(true, 'Error', 'Fields should not be empty!');
      }
    } else {
      this.setState({ isLoading: false });
      this.props.notify(true, 'Error', 'You cannot Edit this.');
    }
  };

  submitPhase2Handler = (e) => {
    e.preventDefault();
    if (this.state.status === 'pending') {
      const descriptionId = this.state.courseDescriptionId;
      const topicsCovered = this.state.topicsCovered;
      const laboratory = this.state.laboratory;
      const programming = this.state.programming;
      const theory = this.state.theory;
      const problem = this.state.problem;
      const solution = this.state.solution;
      const social = this.state.social;
      const oralWritten = this.state.oralWritten;
      if (
        topicsCovered !== '' &&
        laboratory !== '' &&
        programming !== '' &&
        theory !== '' &&
        problem !== '' &&
        solution !== '' &&
        social !== '' &&
        oralWritten !== ''
      ) {
        this.setState({ isLoading: true });
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/adddescription/${descriptionId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({
              phase: 'phase2',
              topicsCovered: topicsCovered,
              laboratory: laboratory,
              programming: programming,
              theory: theory,
              problem: problem,
              solution: solution,
              social: social,
              oralWritten: oralWritten,
            }),
            signal: this.abortController.signal,
          }
        )
          .then((res) => {
            if (!res.ok) throw res;
            return res.json();
          })
          .then((resData) => {
            this.props.history.push('/');
            this.props.notify(true, 'Success', resData.message);
          })
          .catch((err) => {
            this.setState({ isLoading: false });
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
                  err.message +
                    ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
                );
              }
            }
          });
      } else {
        this.setState({ isLoading: false });
        this.props.notify(true, 'Error', 'Fields should not be empty!');
      }
    } else {
      this.setState({ isLoading: false });
      this.props.notify(true, 'Error', 'You cannot Edit this.');
    }
  };

  render() {
    var pageContent = !this.state.phase ? (
      <form method='POST' onSubmit={this.submitPhase1Handler}>
        {Object.entries(this.state.data.phase1).map((row) => {
          return (
            <div className={classes.InputGroup} key={row[0]}>
              <label className={classes.Label}>{row[1]}</label>
              {row[0] === 'assessment' ? (
                <div className={classes.InnerInputGroup}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Assignments</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'new' ? false : true
                            }
                            type='number'
                            name='assignments'
                            value={this.state.assignments}
                            onChange={this.onChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Quizzes</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'new' ? false : true
                            }
                            type='number'
                            name='quizzes'
                            value={this.state.quizzes}
                            onChange={this.onChange}
                            autoComplete='off'
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mid-Term Exam</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'new' ? false : true
                            }
                            type='number'
                            name='midTerm'
                            value={this.state.midTerm}
                            onChange={this.onChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Final Exam</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'new' ? false : true
                            }
                            type='number'
                            name='finalTerm'
                            value={this.state.finalTerm}
                            onChange={this.onChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <TextArea
                  disabled={this.state.status === 'new' ? false : true}
                  rows='2'
                  onChange={this.onChange}
                  name={row[0]}
                  value={this.state[row[0]]}
                  style={{
                    height: '52px',
                    minHeight: '52px',
                    maxHeight: '180px',
                    padding: '2px 6px 2px 10px',
                  }}
                />
              )}
            </div>
          );
        })}
        <div className={classes.ButtonDiv}>
          <Button
            type='button'
            buttonType='red'
            onClick={() => this.props.history.goBack()}
          >
            Go back
          </Button>
          <Button type='submit' disabled={this.state.isLoading ? true : false}>
            {this.state.isLoading ? 'Submitting' : 'Submit Form'}
          </Button>
        </div>
      </form>
    ) : (
      <form method='POST' onSubmit={this.submitPhase2Handler}>
        {Object.entries(this.state.data.phase2).map((row) => {
          return (
            <div className={classes.InputGroup} key={row[0]}>
              <label className={classes.Label}>{row[1]}</label>
              {row[0] === 'classTime' ? (
                <div className={classes.InnerInputGroup}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Theory</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'pending' ? false : true
                            }
                            type='number'
                            name='theory'
                            value={this.state.theory}
                            onChange={this.onChange}
                            autoComplete='off'
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Problem Analysis</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'pending' ? false : true
                            }
                            type='number'
                            name='problem'
                            value={this.state.problem}
                            onChange={this.onChange}
                            autoComplete='off'
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Solution Design</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'pending' ? false : true
                            }
                            type='number'
                            name='solution'
                            value={this.state.solution}
                            onChange={this.onChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Social and Ethical issues</td>
                        <td>
                          <input
                            disabled={
                              this.state.status === 'pending' ? false : true
                            }
                            type='number'
                            name='social'
                            value={this.state.social}
                            onChange={this.onChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <TextArea
                  disabled={this.state.status === 'pending' ? false : true}
                  rows='2'
                  onChange={this.onChange}
                  name={row[0]}
                  value={this.state[row[0]]}
                  style={{
                    height: '52px',
                    minHeight: '52px',
                    maxHeight: '180px',
                    padding: '2px 6px 2px 10px',
                  }}
                />
              )}
            </div>
          );
        })}
        <div className={classes.ButtonDiv}>
          <Button type='submit' disabled={this.state.isLoading ? true : false}>
            {this.state.isLoading ? 'Submitting' : 'Submit Form'}
          </Button>
        </div>
      </form>
    );

    var page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesDescription}>
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
        {this.state.descriptionLoading ? (
          <Spinner />
        ) : this.state.selectCourseId === '' ? (
          <div className={classes.Centered}>Please select a course!</div>
        ) : (
          <>
            <div className={classes.TabsButtons}>
              <div
                className={classes.Button}
                onClick={() => this.setState({ phase: false })}
                style={{
                  borderBottom: this.state.phase ? 'none' : '1px solid #3b3e66',
                }}
              >
                Phase 1
              </div>
              <div
                className={classes.Button}
                onClick={() => this.setState({ phase: true })}
                style={{
                  borderBottom: this.state.phase ? '1px solid #3b3e66' : 'none',
                }}
              >
                Phase 2
              </div>
            </div>
            {pageContent}
          </>
        )}
      </div>
    );

    return page;
  }
}

export default CoursesDescription;
