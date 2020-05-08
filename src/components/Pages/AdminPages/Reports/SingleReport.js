import React, { Component } from 'react';

import classes from './Reports.module.css';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import SingleReportGenerate from '../../../../utils/report/SingleReport';

class SingleReport extends Component {
  state = {
    reportLoading: false,
    teacherSelectLoading: false,
    coursesLoading: false,
    materialLoading: false,
    coursesFetched: false,
    materialsFetched: false,
    sectionChange: false, // to reset section field
    // Data
    courses: '',
    coursesArray: [],
    // Inputs
    selectTeacherId: '',
    selectTeacherTitle: '',
    materials: '',
    materialsArray: [],
    selectMaterialtitle: '',
    selectCourse: '',
    selectCourseId: '',
    selectCourseTitle: '',
    selectCourseSections: [],
    selectSection: '',
    selectSemester: '',
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
    if (this.state.selectSection !== prevState.selectSection) {
      this.onSectionChange();
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
        selectCourseTitle: '',
        selectSection: '',
        selectSemester: '',
        materialsFetched: false,
        materialLoading: false,
      });
      document.getElementById('reportForm').reset();
    } else {
      this.setState({
        selectTeacherTitle: title,
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

  onChangeCourse = (e) => {
    const title = e.target.value;
    if (title === 'Course List' || title === '') {
      this.setState({
        selectCourseId: '',
        selectCourseTitle: title,
        selectSection: '',
        selectSemester: '',
        materialsFetched: false,
        materialLoading: false,
      });
    } else {
      this.setState({
        selectCourseTitle: title,
        materialsFetched: false,
        materialLoading: false,
        sectionChange: true,
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
        selectCourse: courseSelect,
        selectCourseId: courseId,
        selectCourseSections: courseSelect.sections,
        sectionChange: false,
      });
    }
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onSectionChange = async () => {
    const section = this.state.selectSection;
    const courseId = this.state.selectCourseId;
    if (section !== 'Section' && section !== '') {
      this.setState({ materialLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/singlereportdata/${this.state.selectTeacherId}/${courseId}/${section}`,
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
            materials: resData.materials,
            materialsArray: resData.materialsArray,
            materialsFetched: true,
            materialLoading: false,
          });
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
      this.setState({ materialLoading: false, materialsFetched: false });
    }
  };

  reportFormSubmit = (e) => {
    e.preventDefault();
    const selectCourseSection = this.state.selectSection;
    const selectCourseSemester = this.state.selectSemester;
    const materialTitle = this.state.selectMaterialtitle;
    if (
      selectCourseSection &&
      selectCourseSection !== '' &&
      selectCourseSection !== 'Section' &&
      selectCourseSemester &&
      selectCourseSemester !== '' &&
      selectCourseSemester !== 'Semester' &&
      materialTitle &&
      materialTitle !== '' &&
      materialTitle !== 'Material'
    ) {
      this.setState({ reportLoading: true });
      //   var materialId;
      var selectMaterial;
      var found = false;
      Object.values(this.state.materials).map((material) => {
        if (!found) {
          material.some((materialEntry) => {
            if (materialEntry.title === materialTitle) {
              found = true;
              // materialId = materialEntry._id;
              selectMaterial = materialEntry;
              return true;
            }
            return false;
          });
        }
        return true;
      });
      if (found) {
        const info = {
          session: this.state.selectCourse.sessionType,
          batch: this.state.selectCourse.session,
          title: this.state.selectCourse.title,
          code: this.state.selectCourse.code,
          section: selectCourseSection,
          semester: selectCourseSemester,
          materialTitle: materialTitle,
          totalMarks: selectMaterial.marks,
        };
        const batch = this.state.selectCourse.session.split(/-/)[0];
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/class/getclass/${batch}/${selectCourseSection}`,
          {
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
          .then(async (resData) => {
            var data = [];
            resData.class.students.map((student) => {
              return data.push({
                rollNumber: student.rollNumber,
                studentName: student.fullName,
                marks: selectMaterial.result[student.rollNumber],
              });
            });
            await SingleReportGenerate(info, data);
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
        this.props.notify(
          true,
          'Error',
          'Whoops, there was a problem with the materials.'
        );
      }
    } else {
      this.props.notify(true, 'Error', 'Please select all fields.');
    }
  };

  render() {
    return (
      <form method='POST' onSubmit={this.reportFormSubmit} id='reportForm'>
        <div className={classes.InputGroup}>
          <label htmlFor='teacher'>Teacher</label>
          <SelectInput
            name='teacher'
            placeholder='Teacher List'
            onChange={this.onChangeteacher}
          >
            {this.props.teachersArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='course'>Course - Batch</label>
          <SelectInput
            name='course'
            placeholder={
              this.state.teacherSelectLoading ? '...' : 'Course List'
            }
            onChange={this.onChangeCourse}
            disabled={this.state.selectTeacherId === '' ? true : false}
          >
            {this.state.coursesArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSection'>Section</label>
          <SelectInput
            name='selectSection'
            placeholder='Section'
            onChange={this.onChange}
            disabled={this.state.selectCourseId === '' ? true : false}
          >
            {this.state.selectCourseId === ''
              ? []
              : this.state.sectionChange
              ? []
              : this.state.selectCourseSections}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectMaterialtitle'>Material</label>
          <SelectInput
            name='selectMaterialtitle'
            placeholder={this.state.materialLoading ? '...' : 'Material'}
            onChange={this.onChange}
            disabled={this.state.materialsFetched ? false : true}
          >
            {this.state.materialsArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSemester'>Semester</label>
          <SelectInput
            name='selectSemester'
            placeholder={this.state.materialLoading ? '...' : 'Semester'}
            onChange={this.onChange}
            disabled={this.state.materialsFetched ? false : true}
          >
            {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']}
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

export default SingleReport;
