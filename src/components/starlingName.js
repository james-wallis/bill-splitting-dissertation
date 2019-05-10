import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
// import './App.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class starlingName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      error: null
    };
  }

  componentDidMount() {
    axios.get('/api/starling/info')
      .then(result => this.setState({
        username: `${result.data.name.first} ${result.data.name.last}`
      }))
      .catch(error => this.setState({
        error
      }));
  }

  render() {
    const { username } = this.state;
    let infoDiv = (
      <div className={styles.root}>
        <Grid container spacing={32}>
          <Grid item>
            <Paper elevation={1}>
              <Typography variant="h5" component="h6">
                <a className="App-link" href="/starling">Auth Starling</a>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
    if (username) {
      infoDiv = (
        <Grid container spacing={32}>
          <Grid item>
            <Paper elevation={1}>
              <Typography variant="h5" component="h6">
                Logged in as: <br/> {username}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )
    }
    return infoDiv;
  }
}

export default withStyles(styles)(starlingName);
