import React from 'react';

import classes from './SelectInput.module.css';

const SelectInput = props => {
  return (
    <select
      name={props.name}
      onChange={props.onChange}
      className={classes.SelectInput}
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

      {props.children.map(child => {
        return (
          <option value={child} key={child}>
            {child}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
