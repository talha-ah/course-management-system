import React, { Component } from 'react';

import classes from './TeacherList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';

class TeacherList extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    teachers: '',
    totalTeachers: 0,
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/teachers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.setState({
          teachers: resData.teachers,
          totalTeachers: resData.totalTeachers,
          pageLoading: false,
        });
      })
      .catch((err) => {
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
      });
  }

  addTeacherPageHandler = () => {
    this.props.history.push('/addteacher');
  };

  teacherHandler = (id) => {
    console.log(id);
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.TeacherList}>
        <table className={classes.TeacherListTable}>
          <caption>Teachers List</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.teachers.map((teacher) => {
              return (
                <tr key={teacher._id}>
                  <td onClick={() => this.teacherHandler(teacher._id)}>
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td>{teacher.email}</td>
                  <td>{teacher.rank}</td>
                  <td>{teacher.status}</td>
                  <td>
                    <TableButton title='Add Materials'>+</TableButton>
                    <TableButton title='Disable teacher' buttonType='red'>
                      x
                    </TableButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='3'>Total teachers</th>
              <th colSpan='2'>{this.state.totalTeachers}</th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.buttonDiv}>
          <Button onClick={this.addTeacherPageHandler}>Add Teacher</Button>
        </div>
      </div>
    );
    return page;
  }
}

export default TeacherList;
