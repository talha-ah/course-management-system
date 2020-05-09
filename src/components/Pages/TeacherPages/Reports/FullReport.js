import React, { Component } from 'react';

import classes from './Reports.module.css';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import ReportGenerate from '../../../../utils/report/report';

class Report extends Component {
  state = {
    reportLoading: false,
    // Data
    selectCourseId: '',
    selectCourseTitle: 'Course Title',
    selectCourseSections: [],
    selectSection: 'Section',
    selectSemester: 'Semester',
  };

  abortController = new AbortController();

  componentDidMount() {}

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
    if (title === 'Course Title' || title === '') {
      this.setState({
        selectCourseId: '',
        selectCourseTitle: title,
        selectSection: 'Section',
        selectSemester: 'Semester',
      });
    } else {
      this.setState({
        selectCourseTitle: title,
        selectSection: 'Section',
        selectSemester: 'Semester',
      });
    }
  };

  onSelectCourse = async () => {
    const courseTitle1 = this.state.selectCourseTitle;
    const courseTitle = courseTitle1.split(/:{2}/)[0];
    const batch = courseTitle1.split(/:{2}/)[1];
    var courseId;
    var courseSelect;

    if (courseTitle && courseTitle !== '' && courseTitle !== 'Course Title') {
      this.props.courses.some((course) => {
        if (course.title === courseTitle && course.session === batch) {
          courseId = course._id;
          courseSelect = course;
          return true;
        }
        return false;
      });
      this.setState({
        selectCourseId: courseId,
        selectCourseSections: courseSelect.sections,
      });
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  reportFormSubmit = (e) => {
    e.preventDefault();
    const selectCourseId = this.state.selectCourseId;
    const selectCourseSection = this.state.selectSection;
    const selectCourseSemester = this.state.selectSemester;
    const courseTitle1 = this.state.selectCourseTitle;
    const batch = courseTitle1.split(/:{2}/)[1];
    if (
      selectCourseId &&
      selectCourseId !== '' &&
      selectCourseSection &&
      selectCourseSection !== '' &&
      selectCourseSection !== 'Section' &&
      selectCourseSemester &&
      selectCourseSemester !== '' &&
      selectCourseSemester !== 'Section'
    ) {
      this.setState({ reportLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/generatereport/${selectCourseId}/${batch}/${selectCourseSemester}/${selectCourseSection}`,
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
        .then(async (resData) => {
          await ReportGenerate(
            resData.info,
            resData.data,
            resData.assignmentGrade,
            resData.quizGrade
          );
          this.setState({ reportLoading: false });
        })
        .catch((err) => {
          this.setState({ reportLoading: false });
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
      this.props.notify(true, 'Error', 'Please select all fields.');
    }
  };

  render() {
    return (
      <form method='POST' onSubmit={this.reportFormSubmit}>
        <div className={classes.InputGroup}>
          <label htmlFor='course'>Course - Batch</label>
          <SelectInput
            name='course'
            placeholder='Course Title'
            onChange={this.onChangeCourse}
          >
            {this.props.coursesArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSemester'>Semester</label>
          <SelectInput
            name='selectSemester'
            placeholder='Semester'
            onChange={this.onChange}
            disabled={this.state.selectCourseId === '' ? true : false}
            selected={this.state.selectSemester}
          >
            {this.state.selectCourseId === ''
              ? []
              : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSection'>Section</label>
          <SelectInput
            name='selectSection'
            placeholder='Section'
            onChange={this.onChange}
            disabled={this.state.selectCourseId === '' ? true : false}
            selected={this.state.selectSection}
          >
            {this.state.selectCourseId === ''
              ? []
              : this.state.selectCourseSections}
          </SelectInput>
        </div>
        <div className={classes.ButtonDiv}>
          <Button type='submit'>
            {this.state.reportLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </form>
    );
  }
}

export default Report;
