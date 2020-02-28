import React, { Component } from 'react';

import classes from './CoursesList.module.css';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';

class CoursesList extends Component {
  state = {
    isLoading: true,
    courses: '',
    totalCourses: ''
  };

  componentDidMount() {
    const teacherId = '5e4cc7a4781ba62684fe3892';
    fetch(`http://localhost:8080/teacher/courses/${teacherId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Unknown Status Code');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          courses: resData.courses,
          totalCourses: resData.totalCourses,
          isLoading: false
        });
      })
      .catch(err => {
        console.log('CoursesList', err);
      });
  }

  addPageHandler = () => {
    this.props.history.push('/takecourse');
  };

  render() {
    var page = this.state.isLoading ? (
      ''
    ) : (
      <div className={classes.CoursesList}>
        <div className={classes.CoursesListHeader}>
          <h3>CoursesList</h3>
          <p>
            This is your CoursesList page. You can see the progress you've made
            with your courses and manage your Courses
          </p>
        </div>
        <div className={classes.CoursesListArea}>
          <table className={classes.CoursesListTable}>
            <caption>Your Course List</caption>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Course Code</th>
                <th>Section</th>
                <th>Session</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.courses.map(course => {
                return (
                  <tr key={course._id}>
                    <td>{course.courseId.title}</td>
                    <td>{course.courseId.code}</td>
                    <td>{course.sections}</td>
                    <td>{course.session}</td>
                    <td>
                      <TableButton title='Add Materials'>+</TableButton>
                      <TableButton title='Disable Course' color='#f83245'>
                        x
                      </TableButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan='3'>Total courses</th>
                <th colSpan='2'>{this.state.totalCourses}</th>
              </tr>
            </tfoot>
          </table>
          <div className={classes.buttonDiv}>
            <Button onClick={this.addPageHandler}>Add Course</Button>
          </div>
        </div>
      </div>
    );
    return page;
  }
}

export default CoursesList;
