import React, { Component } from 'react';

import classes from './AddTeacher.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddTeacher extends Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Inputs
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
    this.setState({ pageLoading: false });
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    const email = this.state.teacherEmail;
    const code = this.state.teacherCode;
    const rank = this.state.teacherRank;
    const type = this.state.teacherType;
    if (email !== '' && code !== '' && rank !== '' && type !== '') {
      this.setState({ isLoading: true });

      fetch(`${process.env.REACT_APP_SERVER_URL}/admin/createteacher`, {
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
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({ isLoading: false });
          this.props.notify(true, 'Success', resData.message);
          this.props.history.push('/teachers');
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
    } else {
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddTeacher}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>
              Add Teacher{' '}
              <small>(Default password for new teachers is: 'password')</small>
            </strong>
          </span>
        </div>
        <form
          className={classes.Form}
          onSubmit={this.onFormSubmit}
          method='POST'
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
              {this.state.isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddTeacher;
