import React from 'react';

import classes from './TableInput.module.css';

const TableInput = props => {
  return (
    <input
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      min={props.min}
      max={props.max}
      className={[classes.Input, classes.without_ampm].join(' ')}
    />
  );
};

export default TableInput;
