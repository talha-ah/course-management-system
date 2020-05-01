import React, { Component } from 'react';

import classes from './AddCourse.module.css';
import Spinner from '../../../../UI/Spinner/Spinner';
import Button from '../../../../UI/Button/Button';
import Input from '../../../../UI/Input/Input';
import SelectInput from '../../../../UI/SelectInput/SelectInput';

class AddCourse extends Component {
  state = {
    // Loadings
    pageLoading: true,
    isLoading: false,
    // Data
    courseTitle: '',
    courseCode: '',
    courseCredits: 3,
    courseType: 'Compulsory',
    courseSession: 'Fall',
  };

  abortController = new AbortController();

  componentDidMount() {
    this.setState({ pageLoading: false });
  }

  onFormSubmit = (e) => {
    e.preventDefault();

    const title = this.state.courseTitle;
    const code = this.state.courseCode;
    const credits = this.state.courseCredits;
    const type = this.state.courseType;
    const session = this.state.courseSession;
    if (
      title !== '' &&
      code !== '' &&
      credits !== '' &&
      type !== '' &&
      session !== ''
    ) {
      this.setState({ isLoading: true });
      fetch(`${process.env.REACT_APP_SERVER_URL}/admin/createcourse`, {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          code: code,
          credits: credits,
          type: type,
          session: session,
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
          this.props.history.push('/');
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
      this.props.notify(true, 'Error', 'Fields should not be empty!');
    }
  };

  componentWillUnmount() {
    this.abortController.abort();
  }

  onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddCourse}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>Add Course</strong>
          </span>
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
          <div className={classes.InputGroup}>
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
            <Button
              type='button'
              buttonType='red'
              onClick={() => this.props.history.goBack()}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={this.state.isLoading ? true : false}
            >
              {this.state.isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddCourse;
