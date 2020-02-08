import React from 'react';

import classes from './Reports.module.css';

const Reports = () => {
  return (
    <div className={classes.Reports}>
      <div className={classes.ReportsHeader}>
        <h3>Reports Page</h3>
        <p>
          This is your Reports page. You can see the progress you've made with
          your Reports here and manage them
        </p>
      </div>
      <div className={classes.ReportsArea}></div>
    </div>
  );
};

export default Reports;
