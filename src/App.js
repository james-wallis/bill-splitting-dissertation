import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import Router from './pages/router';
import Navigation from './components/navigation';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Navigation />
        <Router />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
