import React, { Component } from 'react';

import classes from './CoursesMonitoring.module.css';
import Button from '../../UI/Button/Button';
import TextArea from '../../UI/TextArea/TextArea';

class CoursesMonitoring extends Component {
  state = {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
    data: {
      0: {
        r1: 'How far objectives have been achieved?',
        r2: 'Full Coverage of contents',
        r3: 'Relevant Problems Skills Development',
        r4: 'Assessment Standards',
        r5: 'Application of emerging technologies'
      }
    }
  };

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  submitHandler = () => {
    const r1 = this.state.r1;
    const r2 = this.state.r2;
    const r3 = this.state.r3;
    const r4 = this.state.r4;
    const r5 = this.state.r5;
    console.log('1', r1, '2', r2, '3', r3, '4', r4, '5', r5);
    console.log('Form Submitted');
  };

  render() {
    return (
      <div className={classes.CoursesMonitoring}>
        <div className={classes.CoursesMonitoringHeader}>
          <h3>Courses Monitoring Process Form</h3>
          <p>
            <u>Institution: Government College University, Lahore</u>
          </p>
          <p>
            <u>Program to be evaluated: Bachelor of Computer Science, BS(CS)</u>
          </p>
        </div>
        <div className={classes.CoursesMonitoringArea}>
          <table className={classes.CoursesMonitoringTable}>
            <caption>
              Subject: <strong>Compiler Construction</strong>
            </caption>
            <caption>
              <strong>
                A. Process to monitor the implementation of courses to ensure{' '}
                the following important attributes:
              </strong>
            </caption>
            <thead>
              <tr>
                <th>Criteria/Attribute</th>
                <th>Existing Process</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.data[0]).map(row => {
                return (
                  <tr key={row[0]}>
                    <td>{row[1]}</td>
                    <td>
                      <TextArea
                        placeholder={row[1]}
                        name={row[0]}
                        rows='8'
                        onChange={this.onChange}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={classes.buttonDiv}>
            <Button onClick={this.submitHandler}>Submit Form</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CoursesMonitoring;
