import React from 'react';

import classes from './App.module.css';
import CMS from './containers/CMS/CMS';

import ErrorBoundary from './components/UI/ErrorBoundary/ErrorBoundary';

const App = () => {
  return (
    <div className={classes.App}>
      <ErrorBoundary>
        <CMS />
      </ErrorBoundary>
    </div>
  );
};

export default App;
