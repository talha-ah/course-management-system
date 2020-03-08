import React from 'react';

import classes from './Button.module.css';

const Button = props => {
  return (
    <button
      className={classes.button}
      name={props.name}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      style={
        props.color
          ? { backgroundColor: props.color }
          : { backgroundColor: '#3b3e66' }
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
