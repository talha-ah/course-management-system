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
          'Context-Free Grammers Versus Regular Expression\nLexical Verasdasdassus Syntactic Analysis',
        evaluationInstruments: 'Exercise for practice',
        Signature: ''
      }
    }
  };

  componentDidMount() {
    console.log(this.props);

    // fetch(`http://localhost:8080/teacher/getcourselog/${courseId}`,{

    // })
    this.setInstantDate();
  }

  setInstantDate = () => {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    var today = now.getFullYear() + '-' + month + '-' + day;
    this.setState({ date: today });
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

  insertRowHandler = () => {
    this.setState({ addingRow: true });
  };

  addRowHandler = () => {
    this.setState({ addingRow: false });
    console.log('Log Added');
  };

  render() {
    return (
      <div className={classes.CoursesLog}>
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
                  <td style={{ padding: '20px' }}>{row[1].date}</td>
                  <td style={{ padding: '20px' }}>{row[1].duration}</td>
                  <td>
                    <TextArea disabled value={row[1].topicsCovered} />
                  </td>
                  <td style={{ padding: '20px' }}>
                    {row[1].evaluationInstruments}
                  </td>
                  <td style={{ padding: '20px' }}>-</td>
                </tr>
              );
            })}
            {this.state.addingRow ? (
              <tr className={classes.AddRow}>
                <td>
                  <TableInput
                    type='date'
                    name='date'
                    value={this.state.date}
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
                    value={this.state.topicsCovered}
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
                  <TableButton
                    className={classes.Button}
                    onClick={this.addRowHandler}
                    type='button'
                  >
                    +
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
    );
  }
}

export default CoursesLog;
