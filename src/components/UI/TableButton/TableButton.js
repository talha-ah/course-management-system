import React from 'react';

import classes from './TableButton.module.css';

const TableButton = (props) => {
  const color = props.buttonType === 'red' ? '#d9534f' : '#3b3e66';
  return (
    <button
      className={classes.Button}
      disabled={props.disabled}
      type={props.type}
      onClick={props.onClick}
      style={{ ...props.style, backgroundColor: color }}
    >
      {props.children}
      {props.title ? (
        <span
          className={classes.tooltiptext}
          style={{ backgroundColor: color }}
        >
          {props.title}
        </span>
      ) : (
        ''
      )}
    </button>
  );
};

export default TableButton;
