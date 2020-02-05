import React from 'react';

import './Input.css';

const Input = props => {
  return (
    <input
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      className='input'
    />
  );
};

export default Input;
