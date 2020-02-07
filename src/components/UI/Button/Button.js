import React from 'react';

import classes from './Button.module.css';

const Button = props => {
  return (
    <button
      className={classes.button}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      style={
        props.color
          ? { backgroundColor: props.color }
          : { backgroundColor: '#5e72e4' }
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
