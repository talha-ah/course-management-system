import React, { Component } from 'react';

import classes from './Reports.module.css';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';
import SingleReportGenerate from '../../../../utils/report/SingleReport';

class SingleReport extends Component {
  state = {
    // Loadings
    reportLoading: false,
    materialLoading: false,
    materialsFetched: false,
    // Inputs
    selectCourse: '',
    selectCourseId: '',
    selectCourseTitle: 'Course Title',
    selectCourseSections: [],
    selectSection: 'Section',
    materials: '',
    materialsArray: [],
    selectMaterialtitle: 'Material',
    selectSemester: 'Semester',
  };

  abortController = new AbortController();

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
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

  onChangeCourse = (e) => {
    const title = e.target.value;
    if (title === 'Course Title' || title === '') {
      this.setState({
        selectCourse: '',
        selectCourseId: '',
        selectCourseTitle: 'Course Title',
        selectCourseSections: [],
        materials: '',
        materialsArray: [],
        selectMaterialtitle: 'Material',
        selectSection: 'Section',
        selectSemester: 'Semester',
        materialsFetched: false,
        materialLoading: false,
      });
    } else {
      this.setState({
        selectCourse: '',
        selectCourseId: '',
        selectCourseTitle: title,
        selectCourseSections: [],
        materials: '',
        materialsArray: [],
        selectMaterialtitle: 'Material',
        selectSection: 'Section',
        selectSemester: 'Semester',
        materialsFetched: false,
        materialLoading: false,
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
        selectCourse: courseSelect,
        selectCourseSections: courseSelect.sections,
      });
    }
  };

  onChangeSection = (e) => {
    const title = e.target.value;
    if (title === 'Section' || title === '') {
      this.setState({
        selectSection: 'Section',
        materials: '',
        materialsArray: [],
        selectMaterialtitle: 'Material',
        selectSemester: 'Semester',
        materialsFetched: false,
        materialLoading: false,
      });
    } else {
      this.setState({
        selectSection: title,
        materials: '',
        materialsArray: [],
        selectMaterialtitle: 'Material',
        selectSemester: 'Semester',
        materialsFetched: false,
        materialLoading: false,
      });
    }
  };

  onSectionChange = async () => {
    const section = this.state.selectSection;
    const courseId = this.state.selectCourseId;
    if (section !== 'Section' && section !== '') {
      this.setState({ materialLoading: true });
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/singlereportdata/${courseId}/${section}`,
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

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'selectMaterialtitle') {
      if (value === 'Material' || value === '') {
        this.setState({
          selectMaterialtitle: 'Material',
          selectSemester: 'Semester',
          materialsFetched: false,
          materialLoading: false,
        });
      } else {
        this.setState({
          selectMaterialtitle: value,
          selectSemester: 'Semester',
        });
      }
    } else if (name === 'selectSemester') {
      this.setState({ [name]: value });
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
      // var materialId;
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
      <form method='POST' onSubmit={this.reportFormSubmit}>
        <div className={classes.InputGroup}>
          <label htmlFor='selectCourseTitle'>Course - Batch</label>
          <SelectInput
            name='selectCourseTitle'
            placeholder='Course Title'
            onChange={this.onChangeCourse}
            selected={this.state.selectCourseTitle}
          >
            {this.props.coursesArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSection'>Section</label>
          <SelectInput
            name='selectSection'
            placeholder='Section'
            onChange={this.onChangeSection}
            selected={this.state.selectSection}
            disabled={this.state.selectCourseId === '' ? true : false}
          >
            {this.state.selectCourseTitle === 'Course Title' ||
            this.state.selectMaterialtitle === ''
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
            selected={this.state.selectMaterialtitle}
            disabled={
              this.state.materialsFetched &&
              this.state.selectSection !== 'Section'
                ? false
                : true
            }
          >
            {this.state.selectSection === 'Section' ||
            this.state.selectSection === ''
              ? []
              : this.state.materialsArray}
          </SelectInput>
        </div>
        <div className={classes.InputGroup}>
          <label htmlFor='selectSemester'>Semester</label>
          <SelectInput
            name='selectSemester'
            placeholder={this.state.materialLoading ? '...' : 'Semester'}
            onChange={this.onChange}
            disabled={
              this.state.materialsFetched &&
              this.state.selectSection !== 'Section'
                ? false
                : true
            }
            selected={this.state.selectSemester}
          >
            {!this.state.materialsFetched
              ? []
              : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']}
          </SelectInput>
        </div>
        <div className={classes.ButtonDiv}>
          <Button
            type='submit'
            disabled={this.state.materialsArray.length === 0 ? true : false}
          >
            {this.state.reportLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </form>
    );
  }
}

export default SingleReport;
