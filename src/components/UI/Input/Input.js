import React from 'react';

import classes from './Input.module.css';

const Input = (props) => {
  return (
    <input
      className={classes.input}
      style={props.style}
      type={props.type}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      disabled={props.disabled}
      min={props.min}
      max={props.max}
      accept={props.accept}
      defaultValue={props.defaultValue}
      autoComplete={props.autoComplete}
    />
  );
};

export default Input;
