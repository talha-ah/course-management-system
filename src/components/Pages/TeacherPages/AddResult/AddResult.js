import React, { Component } from 'react';

import classes from './AddResult.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import SelectInput from '../../../UI/SelectInput/SelectInput';

class AddResult extends Component {
  state = {
    pageLoading: true,
    dataLoading: true,
    isLoading: false,
    class: '',
    materialId: '',
    materialTitle: '',
    materialGrade: 10,
    materialArray: '',
    materialsDoc: '',
    result: ''
  };

  async componentDidMount() {
    const classId = '5e8818614bf86a28fc0b6615';
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/class/getclass/${classId}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        }
      );
      if (!res.ok) throw res;
      const resData = await res.json();

      const tempMaterialArray = [];
      this.props.location.state.materialDoc.assignments.map(material => {
        return tempMaterialArray.push(material.title);
      });

      this.setState({
        class: resData.class,
        materialArray: tempMaterialArray,
        materialId: this.props.location.state.materialId,
        materialTitle: this.props.location.state.materialTitle,
        materialsDoc: this.props.location.state.materialDoc,
        pageLoading: false
      });
    } catch (err) {
      try {
        err.json().then(body => {
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
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.materialTitle !== prevState.materialTitle)
      this.getMaterialFromServer();
  }

  getMaterialFromServer = async () => {
    const materialTitle = this.state.materialTitle;
    var materialId;
    var materialURL;

    if (this.props.location.state.pageFor === 'Assignment') {
      this.state.materialsDoc.assignments.some(material => {
        if (material.title === materialTitle) {
          materialId = material._id;
          return true;
        }
        return false;
      });
      materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/getassignmentresult/${this.state.materialsDoc._id}/${materialId}`;
    }
    if (this.props.location.state.pageFor === 'Quiz') {
      this.state.materialsDoc.quizzes.some(material => {
        if (material.title === materialTitle) {
          materialId = material._id;
          return true;
        }
        return false;
      });
      materialURL = `${process.env.REACT_APP_SERVER_URL}/teacher/getquizresult/${this.state.materialsDoc._id}/${materialId}`;
    }
    try {
      const res = await fetch(materialURL, {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      });
      if (!res.ok) throw res;
      const resData = await res.json();
      this.setState({
        result: resData.material.result,
        materialId: materialId,
        materialTitle: resData.material.title,
        materialGrade: resData.material.grade,
        dataLoading: false
      });
    } catch (err) {
      try {
        err.json().then(body => {
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
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const formData = new FormData(e.target);
    const data = {};
    var error = false;

    for (var [key, value] of formData.entries()) {
      if (value === '' || +value > +this.state.materialGrade) {
        error = true;
      }
      data[key] = value;
    }

    if (!error) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/teacher/addassignmentresult/${this.state.materialsDoc._id}/${this.state.materialId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token
            },
            body: JSON.stringify({ data: data })
          }
        );
        if (!res.ok) throw res;
        const resData = await res.json();
        this.setState({
          result: resData.savedMaterial.result,
          isLoading: false
        });
        this.props.notify(true, 'Success', resData.message);
      } catch (err) {
        this.setState({ isLoading: false });
        try {
          err.json().then(body => {
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
    } else {
      this.setState({ isLoading: false });
      this.props.notify(
        true,
        'Error',
        'Every should not be empty or greater than totals marks!'
      );
    }
  };

  onChangeCourse = e => {
    const title = e.target.value;

    this.setState({
      dataLoading: true,
      materialTitle: title
    });
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.AddResult}>
        <div className={classes.Caption}>
          <span>
            Subject: <strong>{this.props.location.state.courseTitle}</strong>
          </span>
          <span className={classes.CaptionSpan}>
            {this.props.location.state.pageFor}:
            <SelectInput
              style={{
                width: '150px',
                marginLeft: '10px',
                marginRight: '10px'
              }}
              name='materialTitle'
              value={this.state.materialTitle}
              onChange={this.onChangeCourse}
            >
              {this.state.materialArray}
            </SelectInput>
            Marks: {this.state.materialGrade}
          </span>
        </div>
        <form onSubmit={this.onSubmitHandler}>
          <table className={classes.AddResultTable}>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th colSpan='2'>Name</th>
                <th>Section</th>
                <th>Batch</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataLoading ? (
                <tr>
                  <td colSpan='6'>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {Object.entries(this.state.class.students).map(student => {
                    return (
                      <tr
                        key={student[0]}
                        className={classes.AssignmentsTableRow}
                      >
                        <td>
                          <strong>{student[1].rollNumber}</strong>
                        </td>
                        <td style={{ textAlign: 'left' }} colSpan='2'>
                          {student[1].fullName}
                        </td>
                        <td>{this.state.class.section}</td>
                        <td>{this.state.class.batch}</td>
                        <td>
                          <input
                            className={classes.MarksInput}
                            type='number'
                            name={student[1].rollNumber}
                            defaultValue={
                              this.state.result
                                ? this.state.result[student[1].rollNumber]
                                : ''
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>

          <div className={classes.ButtonDiv}>
            <Button type='submit'>
              {this.state.isLoading ? 'Loading' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    );
    return page;
  }
}

export default AddResult;
