import React from 'react';

import classes from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <div className={classes.App}>
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;
