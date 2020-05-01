import React, { Component } from 'react';

import classes from './Teacher.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class Teacher extends Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Tabs
    tab: 'info',
    // Inputs
    teacher: '',
    teacherEmail: '',
    teacherCode: '',
    teacherRank: '',
    teacherType: 'Permanent',
  };

  abortController = new AbortController();

  componentWillUnmount() {
    this.abortController.abort();
  }

  componentDidMount() {
    const teacherId = this.props.match.params.teacherId;
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/teacher/${teacherId}`, {
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
        this.setState({
          teacher: resData.teacher,
          teacherEmail: resData.teacher.email,
          teacherCode: resData.teacher.teacherCode,
          teacherRank: resData.teacher.rank,
          teacherType: resData.teacher.type,
          pageLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
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

  onFormSubmit = (e) => {
    e.preventDefault();
    const email = this.state.teacherEmail;
    const code = this.state.teacherCode;
    const rank = this.state.teacherRank;
    const type = this.state.teacherType;
    if (
      email !== '' &&
      email &&
      code !== '' &&
      code &&
      rank !== '' &&
      rank &&
      type !== '' &&
      type
    ) {
      this.setState({ isLoading: true });

      fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/updateteacher/${this.state.teacher._id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            code: code,
            rank: rank,
            type: type,
          }),
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
          this.setState({ isLoading: false });
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
  };

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  onPasswordUpdate = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/admin/resetteacherpassword/${this.state.teacher._id}`,
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
        this.setState({ isLoading: false });
        this.setState({ tab: 'info' });
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
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Teacher}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>Edit Teacher</strong>
          </span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'info' })}
            style={{
              borderBottom:
                this.state.tab === 'info' ? '1px solid #3b3e66' : '',
            }}
          >
            Teacher Info
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'password' })}
            style={{
              borderBottom:
                this.state.tab === 'password' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Teacher Password
          </div>
        </div>
        {this.state.tab === 'info' ? (
          <form
            method='POST'
            className={classes.Form}
            onSubmit={this.onFormSubmit}
          >
            <div className={classes.InputDiv}>
              <label htmlFor='teacherEmail'>Teacher Email</label>
              <Input
                type='email'
                name='teacherEmail'
                placeholder='Teacher Email'
                value={this.state.teacherEmail}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='teacherCode'>Teacher Code</label>
              <Input
                type='text'
                name='teacherCode'
                placeholder='Teacher Code'
                value={this.state.teacherCode}
                onChange={this.onChange}
              />
            </div>
            <div className={classes.InputDiv}>
              <label htmlFor='teacherRank'>
                Teacher Rank <small>(e.g. Assistant Professor)</small>
              </label>
              <Input
                type='text'
                name='teacherRank'
                placeholder='Teacher Rank'
                value={this.state.teacherRank}
                onChange={this.onChange}
              />
            </div>

            <div className={classes.InputDiv}>
              <label htmlFor='teacherType'>Teacher Type</label>
              <SelectInput
                name='teacherType'
                placeholder='Teacher Type'
                onChange={this.onChange}
                disabled=''
                defaultValue={this.state.teacherType}
              >
                {['Permanent', 'Visiting']}
              </SelectInput>
            </div>

            <div className={classes.ButtonDiv}>
              <Button
                type='button'
                buttonType='red'
                onClick={() => this.props.history.goBack()}
              >
                Cancel
              </Button>
              <Button type='submit'>
                {this.state.isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        ) : this.state.tab === 'password' ? (
          <form
            method='POST'
            className={classes.Form}
            onSubmit={this.onPasswordUpdate}
          >
            <div style={{ margin: '50px 0' }}>
              <center>
                Are you sure that you want to reset password for{' '}
                <strong>{this.state.teacherEmail}</strong>?
              </center>
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                type='submit'
                disabled={this.state.isLoading ? true : false}
              >
                {this.state.isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        ) : (
          ''
        )}
      </div>
    );
    return page;
  }
}

export default Teacher;
