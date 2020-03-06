import React, { Component } from 'react';

import classes from './CoursesList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';

class CoursesList extends Component {
  state = {
    pageLoading: true,
    courses: '',
    totalCourses: 0
  };

  componentDidMount() {
    fetch('http://localhost:8080/admin/courses', {
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
        this.setState({
          courses: resData.courses,
          totalCourses: resData.totalCourses,
          pageLoading: false
        });
      })
      .catch(err => {
        try {
          err.json().then(body => {
            console.log(body);
            console.log('message = ' + body.message);
          });
        } catch (e) {
          console.log('Error parsing promise');
          console.log(err);
        }
      });
  }

  addCoursePageHandler = () => {
    this.props.history.push('/addcourse');
  };

  courseHandler = id => {
    console.log(id);
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.CoursesList}>
        <table className={classes.CoursesListTable}>
          <caption>Course List</caption>
          <thead>
            <tr>
              <th colSpan='2'>Title</th>
              <th>Code</th>
              <th>Type</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.courses.map(course => {
              return (
                <tr key={course._id}>
                  <td
                    colSpan='2'
                    onClick={() => this.courseHandler(course._id)}
                  >
                    {course.title}
                  </td>
                  <td>{course.code}</td>
                  <td>{course.type}</td>
                  <td>{course.credits}</td>
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
              <th colSpan='3'>{this.state.totalCourses}</th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={this.addCoursePageHandler}>Add Course</Button>
        </div>
      </div>
    );
    return page;
  }
}

export default CoursesList;
