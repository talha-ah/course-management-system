import React from 'react';

import classes from './Input.module.css';

const Input = props => {
  return (
    <input
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      className={classes.input}
    />
  );
};

export default Input;
