import React, { Component } from 'react';

import classes from './CoursesDescription.module.css';
import Button from '../../UI/Button/Button';
import TextArea from '../../UI/TextArea/TextArea';

class CoursesDescription extends Component {
  state = {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
    r6: '',
    r7: '',
    r8: '',
    r9: '',
    r10: '',
    r11: '',
    r12: '',
    r13: '',
    r14: '',
    r15: '',
    r16: '',
    data: {
      0: {
        1: 'Course Code',
        2: 'Course Title',
        3: 'Credit Hourse',
        4: 'Prerequisites by Course(s) and Topics',
        5: 'Assessment Instruments with Weight (homework, quizzes, midterms, final, programming assignments, lab work, etc',
        6: 'Course Coordinator',
        7: 'URL (if any)',
        8: 'Current Catalog',
        9: ' Textbook (or Laboratory Manual for Laboratory Courses)',
        10: 'Reference Material',
        11: 'Course Goals',
        12: 'Topic Covered in the Course, with Number of Lectures on Each Topic (assume 15-week instruction and one-hour lectures)',
        13: 'Laboratory Projects/Experiments Done in the Course',
        14: 'Programming Assignments Done in the Course',
        15: 'Class Time Spent on (in credit hourse)',
        16: 'Oral and Written Communications'
      }
    }
  };

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  submitHandler = e => {
    const r1 = e.target.value;
    const r2 = e.target.value;
    const r3 = e.target.value;
    const r4 = e.target.value;
    const r5 = e.target.value;
    const r6 = e.target.value;
    const r7 = e.target.value;
    const r8 = e.target.value;
    const r9 = e.target.value;
    const r10 = e.target.value;
    const r11 = e.target.value;
    const r12 = e.target.value;
    const r13 = e.target.value;
    const r14 = e.target.value;
    const r15 = e.target.value;
    const r16 = e.target.value;
    console.log(
      r1,
      r2,
      r3,
      r4,
      r5,
      r6,
      r7,
      r8,
      r9,
      r10,
      r11,
      r12,
      r13,
      r14,
      r15,
      r16
    );
    console.log('Form Submitted');
  };

  render() {
    return (
      <div className={classes.CoursesDescription}>
        <div className={classes.CoursesDescriptionHeader}>
          <h3>Courses Description Process Form</h3>
          <p>
            <u>Institution: Government College University, Lahore</u>
          </p>
          <p>
            <u>Program to be evaluated: Bachelor of Computer Science, BS(CS)</u>
          </p>
        </div>
        <div className={classes.CoursesDescriptionArea}>
          <table className={classes.CoursesDescriptionTable}>
            <caption>
              Subject: <strong>Compiler Construction</strong>
            </caption>
            <thead>
              <tr>
                <th></th>
                <th></th>
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

export default CoursesDescription;
