import React from 'react';

import classes from './SelectInput.module.css';

const SelectInput = (props) => {
  return (
    <select
      className={classes.SelectInput}
      name={props.name}
      onChange={props.onChange}
      style={props.style}
    >
      {props.defaultValue !== '' ? (
        ''
      ) : (
        <option
          disabled={props.disabled}
          defaultValue={props.defaultValue}
          className={classes.Placeholder}
        >
          {props.placeholder}
        </option>
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
