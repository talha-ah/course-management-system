import React from 'react';

import classes from './Spinner.module.css';

const Spinner = (props) => {
  var styles = {
    width: '5em',
    height: '5em',
  };
  if (props.size && props.size === 'Big')
    styles = {
      width: '10em',
      height: '10em',
    };

  return (
    <div className={classes.Spinner} style={styles}>
      Loading...
    </div>
  );
};

export default Spinner;
