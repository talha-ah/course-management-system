import React from 'react';

import classes from './TextArea.module.css';

const TextArea = props => {
  return (
    <textarea
      name={props.name}
      placeholder={props.placeholder}
      rows={props.rows}
      onChange={props.onChange}
      className={classes.TextArea}
    >
      {props.value}
    </textarea>
  );
};

export default TextArea;
