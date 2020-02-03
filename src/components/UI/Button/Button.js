import React from 'react';

import './Button.css';

const Button = props => {
  return (
    <button className='button' href={props.link}>
      {props.children}
    </button>
  );
};

export default Button;
