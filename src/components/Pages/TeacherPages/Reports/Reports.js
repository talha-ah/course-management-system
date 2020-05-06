import React, { Component } from 'react';

import classes from './Reports.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import SingleReport from './SingleReport';
import FullReport from './FullReport';

class Report extends Component {
  state = {
    // Loadings
    pageLoading: true,
    // Tabs
    tab: 'single',
    // Data
    courses: '',
    coursesArray: '',
  };

  abortController = new AbortController();

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/teacher/courses`, {
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
        const arrayCourses = [];
        resData.courses.map((course) => {
          return arrayCourses.push(course.title + '::' + course.session);
        });

        this.setState({
          courses: resData.courses,
          coursesArray: arrayCourses,
          pageLoading: false,
        });
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
              err.message + ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
            );
          }
        }
      });
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Reports}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>Generate Report</span>
        </div>
        <div className={classes.TabsButtons}>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'single' })}
            style={{
              borderBottom:
                this.state.tab === 'single' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Single Report
          </div>
          <div
            className={classes.Button}
            onClick={() => this.setState({ tab: 'full' })}
            style={{
              borderBottom:
                this.state.tab === 'full' ? '1px solid #3b3e66' : 'none',
            }}
          >
            Full Report
          </div>
        </div>
        {this.state.tab === 'single' ? (
          <SingleReport
            courses={this.state.courses}
            coursesArray={this.state.coursesArray}
            {...this.props}
          />
        ) : (
          <FullReport
            courses={this.state.courses}
            coursesArray={this.state.coursesArray}
            {...this.props}
          />
        )}
      </div>
    );
    return page;
  }
}

export default Report;
