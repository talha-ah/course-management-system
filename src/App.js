import React from 'react';

import classes from './App.module.css';
import CMS from './containers/CMS/CMS';

const App = () => {
  return (
    <div className={classes.App}>
      <CMS />
    </div>
  );
};

export default App;
