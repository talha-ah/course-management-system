import React from 'react';

import classes from './CoursesList.module.css';
import Button from '../../../UI/Button/Button';
import TableButton from '../../../UI/TableButton/TableButton';

const CoursesList = props => {
  return (
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
            <tr>
              <td>Compiler Construction</td>
              <td>CS1976</td>
              <td>A,B</td>
              <td>2016-2020</td>
              <td>
                <TableButton title='Add Materials'>+</TableButton>
                <TableButton title='Disable Course' color='#f83245'>
                  x
                </TableButton>
              </td>
            </tr>
            <tr>
              <td>Artificial Intelligence</td>
              <td>CS1986</td>
              <td>A,B</td>
              <td>2016-2020</td>
              <td>
                <TableButton title='Add Materials'>+</TableButton>
                <TableButton title='Disable Course' color='#f83245'>
                  x
                </TableButton>
              </td>
            </tr>

            <tr>
              <td>Machine Learning</td>
              <td>CS1996</td>
              <td>A,B</td>
              <td>2016-2020</td>
              <td>
                <TableButton title='Add Materials'>+</TableButton>
                <TableButton title='Disable Course' color='#f83245'>
                  x
                </TableButton>
              </td>
            </tr>
            <tr>
              <td>Machine Learning</td>
              <td>CS2006</td>
              <td>A,B</td>
              <td>2016-2020</td>
              <td>
                <TableButton title='Add Materials'>+</TableButton>
                <TableButton title='Disable Course' color='#f83245'>
                  x
                </TableButton>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='3'>Total courses</th>
              <th colSpan='2'>3</th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={props.addCoursePageHandler}>Add Course</Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
