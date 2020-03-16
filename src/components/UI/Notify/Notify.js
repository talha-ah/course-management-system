import React, { Component } from 'react';

import classes from './Notify.module.css';

class Notify extends Component {
  state = {
    notifyVis: false
  };

  componentDidMount() {
    if (this.props.notify) this.openNotify();
    setTimeout(() => {
      this.closeNotify();
    }, 3000);
  }

  openNotify = () => this.setState({ notifyVis: true });
  closeNotify = () => this.setState({ notifyVis: false });

  render() {
    var styles = {
      color: '',
      borderColor: ''
    };

    switch (this.props.type) {
      case 'Success':
        styles.color = 'green';
        styles.borderColor = 'green';
        break;
      case 'Error':
        styles.color = 'red';
        styles.borderColor = 'red';
        break;
      default:
    }

    return (
      <div
        className={classes.Notify}
        style={{
          color: styles.color,
          border: `1px solid ${styles.borderColor}`,
          zIndex: this.state.notifyVis ? '3' : '-3'
        }}
      >
        <div className={classes.NotifyTitleBar}>
          <div>{this.props.type}</div>
          <div className={classes.CloseButton} onClick={this.closeNotify}>
            x
          </div>
        </div>
        <hr style={{ border: `0.5px solid ${styles.borderColor}` }} />
        <div className={classes.NotifyBody}>
          <div>{this.props.message}</div>
        </div>
      </div>
    );
  }
}

export default Notify;
