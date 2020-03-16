import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../../UI/Button/Button';
import classes from './pagefour.module.css';

const onClickHandler = props => {
  props.history.replace('/');
};

const Error404 = props => {
  return (
    <div className={classes.site}>
      <h1>
        404:
        <small>Page Not Found</small>
      </h1>
      <div>
        <Button type='button' onClick={() => onClickHandler(props)}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default withRouter(Error404);
