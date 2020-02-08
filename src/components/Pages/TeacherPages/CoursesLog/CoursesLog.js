import React, { Component } from 'react';

import classes from './CoursesLog.module.css';
import Button from '../../../UI/Button/Button';
import TableButton from '../../../UI/TableButton/TableButton';
import TableInput from '../../../UI/TableInput/TableInput';
import TextArea from '../../../UI/TextArea/TextArea';

class CoursesLog extends Component {
  state = {
    date: '',
    duration: '01:30',
    topicsCovered: '',
    evaluationInstruments: '',
    addingRow: false,
    data: {
      0: {
        date: '13/03/18',
        duration: '1:30',
        topicsCovered:
          'Context-Free Grammers Versus Regular Expression\nLexical Versus Syntactic Analysis',
        evaluationInstruments: 'Exercise for practice',
        Signature: ''
      },
      1: {
        date: '13/03/18',
        duration: '1:30',
        topicsCovered:
          'Context-Free Grammers Versus Regular Expression\nLexical Versus Syntactic Analysis',
        evaluationInstruments: 'Exercise for practice',
        Signature: ''
      }
    }
  };

  componentDidMount() {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    //   var 2digityear = now.getFullYear().toString().substr(-2);

    var today = now.getFullYear() + '-' + month + '-' + day;
    this.setState({ date: today });
  }

  insertRowHandler = () => {
    this.setState({ addingRow: true });
  };

  addRowHandler = () => {
    this.setState({ addingRow: false });
    console.log('Log Added');
  };

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
    console.log(name);
    console.log(value);
  };

  render() {
    return (
      <div className={classes.CoursesLog}>
        <div className={classes.CoursesLogHeader}>
          <h3>Courses Log Template</h3>
          <p>
            <u>Institution: Government College University, Lahore</u>
          </p>
          <p>
            <u>Program to be evaluated: Bachelor of Computer Science, BS(CS)</u>
          </p>
        </div>
        <div className={classes.CoursesLogArea}>
          <table className={classes.CoursesLogTable}>
            <caption>
              Subject: <strong>Compiler Construction</strong>
            </caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Topics Covered</th>
                <th>Evaluation Instruments</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.data).map(row => {
                return (
                  <tr key={row} className={classes.CoursesLogTableRow}>
                    <td>{row[1].date}</td>
                    <td>{row[1].duration}</td>
                    <td>{row[1].topicsCovered}</td>
                    <td>{row[1].evaluationInstruments}</td>
                    <td>-</td>
                  </tr>
                );
              })}
              {this.state.addingRow ? (
                <tr>
                  <td>
                    <TableInput
                      type='date'
                      name='date'
                      value={this.state.date}
                      // min='2018-01-01'
                      // max='2018-12-31'
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <TableInput
                      type='time'
                      name='duration'
                      value={this.state.duration}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <TextArea
                      placeholder='Topics Covered'
                      name='topicsCovered'
                      rows='2'
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <TableInput
                      type='text'
                      placeholder='Evaluation Instruments'
                      name='evaluationInstruments'
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <TableButton onClick={this.addRowHandler}>
                      <span>&#10003;</span>
                    </TableButton>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className={classes.buttonDiv}>
            <Button
              onClick={this.insertRowHandler}
              disabled={this.state.addingRow ? true : false}
            >
              Add Log Row
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CoursesLog;
