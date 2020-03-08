import React from 'react';

import classes from './Modal.module.css';

const Modal = props => {
  const displayModal = props.visible ? 'block' : 'none';
  return (
    <div className={classes.modal} style={{ display: displayModal }}>
      <div className={classes.modalContent}>{props.children}</div>
    </div>
  );
};

export default Modal;
