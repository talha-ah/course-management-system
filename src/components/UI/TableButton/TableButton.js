import React from 'react';

import classes from './TableButton.module.css';

const TableButton = props => {
  return (
    <button
      className={classes.Tablebutton}
      type={props.type}
      onClick={props.onClick}
      style={
        props.color
          ? { backgroundColor: props.color }
          : { backgroundColor: '#3b3e66' }
      }
    >
      {props.children}
      {props.title ? (
        <span
          className={classes.tooltiptext}
          style={
            props.color
              ? { backgroundColor: props.color }
              : { backgroundColor: '#3b3e66' }
          }
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
