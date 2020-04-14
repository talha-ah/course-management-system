import React, { Component } from 'react';

import classes from './Notify.module.css';

class Notify extends Component {
  state = {
    notifyVis: false,
  };

  componentDidMount() {
    if (this.props.notify) this.openNotify();

    this.timerHandle = setTimeout(() => {
      this.closeNotify();
    }, 3000);
  }

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  openNotify = () => this.setState({ notifyVis: true });
  closeNotify = () => this.setState({ notifyVis: false });

  render() {
    var styles = {
      color: '',
      borderColor: '',
    };

    switch (this.props.type) {
      case 'Success':
        styles.color = '#4F8A10';
        styles.borderColor = '#4F8A10';
        break;
      case 'Error':
        styles.color = '#c72222';
        styles.borderColor = '#c72222';
        break;
      default:
    }

    return (
      <div
        className={classes.Notify}
        style={{
          color: styles.color,
          border: `1px solid ${styles.borderColor}`,
          zIndex: this.state.notifyVis ? '3' : '-3',
        }}
      >
        <div className={classes.NotifyTitleBar}>
          <div>{this.props.type}</div>
          <button
            type='button'
            className={classes.CloseButton}
            onClick={this.closeNotify}
            style={{ borderColor: styles.borderColor, color: styles.color }}
          >
            x
          </button>
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
