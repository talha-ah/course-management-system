import React from 'react';

import classes from './TextArea.module.css';

const TextArea = props => {
  return (
    <textarea
      style={props.style}
      className={classes.TextArea}
      name={props.name}
      placeholder={props.placeholder}
      rows={props.rows}
      onChange={props.onChange}
      disabled={props.disabled}
      value={props.value}
      defaultValue={props.defaultValue}
    />
  );
};

export default TextArea;
