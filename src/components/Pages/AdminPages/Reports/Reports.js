import React, { Component } from 'react';

import classes from './Reports.module.css';

class Report extends Component {
  render() {
    return (
      <div className={classes.Reports}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            <strong>Reports Loading ...</strong>
          </span>
        </div>
      </div>
    );
  }
}

export default Report;
