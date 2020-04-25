import React, { Component } from 'react';

import classes from './Material.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';

class Material extends Component {
  state = {
    pageLoading: true,
    updateLoading: false,
    materialLoading: false,
    solutionLoading: false,
    // Data
    material: '',
    // Inputs
  };

  abortController = new AbortController();

  componentDidMount() {
    var url;
    if (this.props.location.state.pageFor === 'Assignment') {
      url = 'getassignment';
    } else if (this.props.location.state.pageFor === 'Quiz') {
      url = 'getquiz';
    } else if (this.props.location.state.pageFor === 'Paper') {
      url = 'getpaper';
    }
    if (url) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/${url}/${this.props.location.state.materialDocId}/${this.props.location.state.materialId}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.token,
          },
          signal: this.abortController.signal,
        }
      )
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((resData) => {
          this.setState({
            material: resData.material,
            pageLoading: false,
          });
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
          } else {
            this.setState({ isLoading: false });
            try {
              err.json().then((body) => {
                this.props.notify(
                  true,
                  'Error',
                  body.error.status + ' ' + body.message
                );
              });
            } catch (e) {
              this.props.notify(
                true,
                'Error',
                err.message +
                  ' Error parsing promise\nSERVER_CONNECTION_REFUSED!'
              );
            }
          }
        });
    } else {
      this.props.notify(true, 'Error', 'Whoops, something went wrong!');
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  downloadFileHandler = async (name, path, loading) => {
    // var name = path.split(/[/]+/g)[2];
    // name = name.substring(24);
    this.setState({ [loading]: true });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/${path}`
      );
      if (!response.ok) throw response;
      const buffer = await response.arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const element = document.createElement('a');
      element.style.display = 'none';
      element.href = url;
      element.setAttribute('download', name); //or any other extension
      document.body.appendChild(element);
      element.click();
      this.setState({ [loading]: false });
      window.URL.revokeObjectURL(element.href);
      document.body.removeChild(element);
    } catch (err) {
      if (err.name === 'AbortError') {
      } else {
        this.props.notify(true, 'Error', 'Whoops, file not found!');
      }
    }
  };

  render() {
    const page = this.state.pageLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Material}>
        <div className={classes.Caption}>
          <span className={classes.CaptionSpan}>
            {this.props.location.state.title} -{' '}
            {this.props.location.state.section}
          </span>
        </div>

        <div className={classes.MaterialBody}>
          <div className={classes.InputGroup}>
            <div className={classes.InputDiv}>
              <label>Title</label>
            </div>
            <div className={classes.InputDiv}>
              <span>{this.state.material.title}</span>
            </div>
          </div>
          <hr />
          <div className={classes.InputGroup}>
            <div className={classes.InputDiv}>
              <label>Batch</label>
            </div>
            <div className={classes.InputDiv}>
              <span>{this.state.material.batch}</span>
            </div>
          </div>
          <hr />
          <div className={classes.InputGroup}>
            <div className={classes.InputDiv}>
              <label>Section</label>
            </div>
            <div className={classes.InputDiv}>
              <span>{this.state.material.section}</span>
            </div>
          </div>
          <hr />
          <div className={classes.InputGroup}>
            <div className={classes.InputDiv}>
              <label>Marks</label>
            </div>
            <div className={classes.InputDiv}>
              <span>{this.state.material.marks}</span>
            </div>
          </div>
          <hr />

          <div className={classes.ButtonDiv}>
            <Button
              type='button'
              onClick={() => {
                if (this.props.location.state.pageFor === 'Assignment') {
                  this.downloadFileHandler(
                    this.state.material.assignment.name,
                    this.state.material.assignment.path,
                    'materialLoading'
                  );
                } else if (this.props.location.state.pageFor === 'Quiz') {
                  this.downloadFileHandler(
                    this.state.material.quiz.name,
                    this.state.material.quiz.path,
                    'materialLoading'
                  );
                } else if (this.props.location.state.pageFor === 'Paper') {
                  this.downloadFileHandler(
                    this.state.material.paper.name,
                    this.state.material.paper.path,
                    'materialLoading'
                  );
                }
              }}
            >
              {this.state.materialLoading
                ? 'Downloading...'
                : `Download ${this.props.location.state.pageFor}`}
            </Button>
            <Button
              type='button'
              onClick={this.downloadFileHandler.bind(
                this,
                this.state.material.solution.name,
                this.state.material.solution.path,
                'solutionLoading'
              )}
            >
              {this.state.solutionLoading
                ? 'Downloading...'
                : 'Download Solution'}
            </Button>
          </div>
        </div>
      </div>
    );
    return page;
  }
}

export default Material;
