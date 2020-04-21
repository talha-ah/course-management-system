import React from 'react';

import classes from './SelectInput.module.css';

const SelectInput = (props) => {
  return (
    <select
      className={classes.SelectInput}
      style={props.style}
      name={props.name}
      onChange={props.onChange}
      disabled={props.disabled}
      value={props.selected}
    >
      {props.placeholder !== '' && props.placeholder ? (
        <option className={classes.Placeholder}>{props.placeholder}</option>
      ) : (
        ''
      )}
      {props.children.map((child) => {
        return (
          <option value={child} key={child} className={classes.Option}>
            {child}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
