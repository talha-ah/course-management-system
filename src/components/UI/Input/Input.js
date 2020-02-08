import React from 'react';

import classes from './Input.module.css';

const Input = props => {
  return (
    <input
      type={props.type}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      className={classes.input}
    />
  );
};

export default Input;
