import React from 'react';

import classes from './Button.module.css';

const Button = (props) => {
  const styles =
    props.buttonType === 'red'
      ? classes.buttonRed
      : props.buttonType === 'green'
      ? classes.buttonGreen
      : classes.button;
  return (
    <button
      className={styles}
      name={props.name}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
