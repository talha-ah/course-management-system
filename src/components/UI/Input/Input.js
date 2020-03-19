import React from 'react';

import classes from './Input.module.css';

const Input = props => {
  return (
    <input
      disabled={props.disabled}
      type={props.type}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      className={classes.input}
      min={props.min}
      max={props.max}
      accept={props.accept}
    />
  );
};

export default Input;
