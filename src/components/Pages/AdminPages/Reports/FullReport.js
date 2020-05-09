import React, { Component } from 'react';

import classes from './Reports.module.css';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import ReportGenerate from '../../../../utils/report/report';

class FullReport extends Component {
  state = {
    reportLoading: false,
    teacherSelectLoading: false,
    // Data
    courses: '',
    coursesArray: [],
    selectCourseSections: [],
    // Inputs
    selectTeacherId: '',
    selectTeacherTitle: 'Teacher List',
    selectCourseId: '',
    selectCourseTitle: 'Course Title',
    selectSection: 'Section',
    selectSemester: 'Semester',
  };

  abortController = new AbortController();

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectTeacherTitle !== prevState.selectTeacherTitle) {
      this.onSelectTeacher();
    }
    if (this.state.selectCourseTitle !== prevState.selectCourseTitle) {
      this.onSelectCourse();
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChangeteacher = (e) => {
    const title = e.target.value;
    if (title === 'Teacher List' || title === '') {
      this.setState({
        selectTeacherId: '',
        selectTeacherTitle: title,
        selectCourseId: '',
        selectCourseTitle: 'Course Title',
        selectSection: 'Section',
        selectSemester: 'Semester',
      });
      document.getElementById('reportForm').reset();
    } else {
      this.setState({
        selectTeacherId: '',
        selectTeacherTitle: title,
        selectCourseId: '',
        selectCourseTitle: 'Course Title',
        selectSection: 'Section',
        selectSemester: 'Semester',
      });
    }
  };

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
        selectCourseId: '',
        selectCourseTitle: title,
        selectSection: 'Section',
        selectSemester: 'Semester',
      });
    }
  };

  onSelectTeacher = () => {
    const teacherTitle = this.state.selectTeacherTitle;
    var teacherId;
    var selectedTeacher;

    if (
      teacherTitle &&
      teacherTitle !== '' &&
      teacherTitle !== 'Teacher List'
    ) {
      this.setState({ teacherSelectLoading: true });
      this.props.teachers.some((teacher) => {
        if (teacher.firstName + ' ' + teacher.lastName === teacherTitle) {
          teacherId = teacher._id;
          selectedTeacher = teacher;
          return true;
        }
        return false;
      });
      fetch(`${process.env.REACT_APP_SERVER_URL}/admin/courses`, {
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
          const courses = [];
          const arrayCourses = [];
          resData.courses.map((adminCourse) => {
            selectedTeacher.coursesAssigned.map((course) => {
              if (course.courseId.toString() === adminCourse._id.toString()) {
                arrayCourses.push(adminCourse.title + '::' + course.session);

                courses.push({
                  _id: course._id,
                  courseId: adminCourse._id,
                  title: adminCourse.title,
                  code: adminCourse.code,
                  credits: adminCourse.credits,
                  type: adminCourse.type,
                  sessionType: adminCourse.session,
                  status: course.status,
                  sections: course.sections,
                  session: course.session,
                });
              }
              return true;
            });
            return true;
          });
          this.setState({
            selectTeacherId: teacherId,
            courses: courses,
            coursesArray: arrayCourses,
            teacherSelectLoading: false,
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
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          }
        });
    }
  };

  onSelectCourse = async () => {
    const courseTitle1 = this.state.selectCourseTitle;
    const courseTitle = courseTitle1.split(/:{2}/)[0];
    const batch = courseTitle1.split(/:{2}/)[1];
    var courseId;
    var courseSelect;

    if (courseTitle && courseTitle !== '' && courseTitle !== 'Course List') {
      this.state.courses.some((course) => {
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
        `${process.env.REACT_APP_SERVER_URL}/admin/generatereport/${this.state.selectTeacherId}/${selectCourseId}/${batch}/${selectCourseSemester}/${selectCourseSection}`,
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
      <form method='POST' onSubmit={this.reportFormSubmit} id='reportForm'>
        <div className={classes.InputGroup}>
          <label htmlFor='selectTeacherTitle'>Teacher</label>
          <SelectInput
            name='selectTeacherTitle'
            placeholder='Teacher List'
            onChange={this.onChangeteacher}
            selected={this.state.selectTeacherTitle}
          >
            {this.props.teachersArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectCourseTitle'>Course - Batch</label>
          <SelectInput
            name='selectCourseTitle'
            placeholder={
              this.state.teacherSelectLoading ? '...' : 'Course Title'
            }
            onChange={this.onChangeCourse}
            disabled={this.state.selectTeacherId === '' ? true : false}
            selected={this.state.selectCourseTitle}
          >
            {this.state.selectTeacherId === '' ? [] : this.state.coursesArray}
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
            {this.state.reportLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    );
  }
}

export default FullReport;
