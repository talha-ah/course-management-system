import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './AddCourse.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddCourse extends Component {
  state = {
    pageLoading: true,
    isLoading: false,
    courseTitle: '',
    courseCode: '',
    courseCredits: 3,
    courseType: 'Compulsory',
    courseSession: 'Fall'
  };

  componentDidMount() {
    this.setState({ pageLoading: false });
  }

  onFormSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    fetch('http://localhost:8080/admin/createcourse', {
      method: 'POST',
      body: JSON.stringify({
        title: this.state.courseTitle,
        code: this.state.courseCode,
        credits: this.state.courseCredits,
        type: this.state.courseType,
        session: this.state.courseSession
      }),
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
        this.setState({ isLoading: false });
        console.log(resData);
        this.props.history.push('/');
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
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  onFormCancel = e => {
    this.props.history.goBack();
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddCourse}>
        <div className={classes.Title}>
          <h4>Add Course</h4>
        </div>
        <form
          className={classes.Form}
          onSubmit={this.onFormSubmit}
          method='POST'
        >
          <div className={classes.InputDiv}>
            <label htmlFor='courseTitle'>Course Title</label>
            <Input
              type='text'
              name='courseTitle'
              placeholder='Course Title'
              value={this.state.courseTitle}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseCode'>Course Code</label>
            <Input
              type='text'
              name='courseCode'
              placeholder='Course Code'
              value={this.state.courseCode}
              onChange={this.onChange}
            />
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseCredits'>Course Credits</label>
            <Input
              type='number'
              name='courseCredits'
              placeholder='Course Credits'
              value={this.state.courseCredits}
              onChange={this.onChange}
            />
          </div>

          <div className={classes.InputDiv}>
            <label htmlFor='courseType'>Course Type</label>
            <SelectInput
              name='courseType'
              placeholder='Course Type'
              onChange={this.onChange}
              disabled=''
              defaultValue={this.state.courseType}
            >
              {['Complusory', 'Elective']}
            </SelectInput>
          </div>
          <div className={classes.InputDiv}>
            <label htmlFor='courseSession'>Course Session</label>
            <SelectInput
              name='courseSession'
              placeholder='Course Session'
              onChange={this.onChange}
              disabled=''
              defaultValue={this.state.courseSession}
            >
              {['Fall', 'Summer']}
            </SelectInput>
          </div>

          <div className={classes.ButtonDiv}>
            <Button type='button' onClick={this.onFormCancel} color='#f83245'>
              Cancel
            </Button>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default withRouter(AddCourse);
