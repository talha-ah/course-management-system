import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import classes from './TeacherList.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import TableButton from '../../../../UI/TableButton/TableButton';
import Modal from '../../../../UI/Modal/Modal';

class TeacherList extends Component {
  state = {
    // Loadings
    pageLoading: true,
    contentLoading: false,
    disableModal: false,
    isLoading: false,
    // Data
    teachers: '',
    totalTeachers: 0,
    selectTeacherId: '',
    selectTeacherName: '',
    // Tabs
    tab: 'Active',
  };

  componentDidMount() {
    this.fetchTeachers();
  }

  fetchTeachers = () => {
    this.setState({ contentLoading: true });
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
          contentLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ contentLoading: false });
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
  };

  onDisableTeacher = () => {
    this.setState({
      isLoading: true,
    });
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/admin/deactiveteacher/${this.state.selectTeacherId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((resData) => {
        this.setState({
          disableModal: false,
          isLoading: false,
        });
        this.fetchTeachers();
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
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
  };

  addTeacherPageHandler = () => {
    this.props.history.push('/addteacher');
  };

  teacherHandler = (id) => {
    console.log(id);
  };

  render() {
    var activeTeachers = 0;
    var inactiveTeachers = 0;
    var pendingTeachers = 0;

    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.TeacherList}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>Teachers List</span>
          <span className={classes.CaptionSpan}>
            Total Teachers: {this.state.totalTeachers}
          </span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'Active' })}
            style={{
              borderBottom:
                this.state.tab === 'Active' ? '1px solid #3b3e66' : '',
            }}
          >
            Active Teachers
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'Inactive' })}
            style={{
              borderBottom:
                this.state.tab === 'Inactive' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Inactive Teachers
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'Pending' })}
            style={{
              borderBottom:
                this.state.tab === 'Pending' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Pending Teachers
          </div>
        </div>
        <table className={classes.TeacherListTable}>
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
            {this.state.contentLoading ? (
              <tr>
                <td colSpan='5'>
                  <Spinner />
                </td>
              </tr>
            ) : this.state.totalTeachers <= 0 ? (
              <tr>
                <td colSpan='5'>No teachers found!.</td>
              </tr>
            ) : (
              this.state.teachers.map((teacher) => {
                if (this.state.tab === 'Active') {
                  if (teacher.status === 'Active') {
                    activeTeachers++;
                  } else {
                    return true;
                  }
                } else if (this.state.tab === 'Inactive') {
                  if (teacher.status === 'Inactive') {
                    inactiveTeachers++;
                  } else {
                    return true;
                  }
                } else {
                  if (teacher.status === 'Pending') {
                    pendingTeachers++;
                  } else {
                    return true;
                  }
                }
                return (
                  <tr key={teacher._id}>
                    <td onClick={this.teacherHandler.bind(this, teacher._id)}>
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.rank}</td>
                    <td>{teacher.status}</td>
                    <td>
                      <TableButton
                        title='Disable teacher'
                        disabled={teacher.status === 'Active' ? '' : 'disabled'}
                        buttonType='red'
                        onClick={() => {
                          this.setState({
                            selectTeacherId: teacher._id,
                            selectTeacherName:
                              teacher.firstName + ' ' + teacher.lastName,
                            disableModal: true,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} size='sm' />
                      </TableButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='3'>
                {this.state.tab === 'Active'
                  ? 'Active Teachers'
                  : this.state.tab === 'Inactive'
                  ? 'Inactive Teachers'
                  : 'Pending Teachers'}
              </th>
              <th colSpan='2'>
                {this.state.tab === 'Active'
                  ? activeTeachers
                  : this.state.tab === 'Inactive'
                  ? inactiveTeachers
                  : pendingTeachers}
              </th>
            </tr>
          </tfoot>
        </table>
        <div className={classes.ButtonDiv}>
          <Button onClick={this.addTeacherPageHandler}>
            {this.state.disableModal ? 'Disabling...' : 'Add Teacher'}
          </Button>
        </div>
        {/* ===================================  Disable Teacher Modal Starts ===============================*/}
        <Modal visible={this.state.disableModal}>
          <div className={classes.Modal}>
            <div className={classes.ModalBody}>
              <div className={classes.ModalContent}>
                <div className={classes.ModalContentTitle}>
                  Deactivate Teacher!
                </div>
                <div className={classes.ModalContentBody}>
                  <p>
                    Are you really sure to deactivate{' '}
                    <strong>{this.state.selectTeacherName}?</strong>
                  </p>
                </div>
              </div>
              <div className={classes.ButtonDiv}>
                <Button
                  type='button'
                  onClick={() => this.setState({ disableModal: false })}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  buttonType='red'
                  onClick={this.onDisableTeacher}
                >
                  {this.state.isLoading ? 'Disabling...' : 'Disable'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* ===================================  Disable Teacher Modal Ends ===============================*/}
      </div>
    );
    return page;
  }
}

export default TeacherList;
