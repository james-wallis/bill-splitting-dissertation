import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  },
  button: {
    margin: '0 10px'
  },
  link: {
    textDecoration: 'none'
  }
});

class Navigation extends Component {
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
        username: `${result.data.firstName} ${result.data.lastName}`
      }))
      .catch(error => this.setState({
        error
      }));
  }

  render() {
    const { classes } = this.props;
    const { username } = this.state;
    return (
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            {(username) ? `Logged in as: ${username}` : 'Split the bill '}
          </Typography>
          <Link to="/create" className={classes.link}>
            <Button className={classes.button}>Create</Button>
          </Link>
          <Link to="/join" className={classes.link}>
            <Button color="primary" variant="outlined" className={classes.button}>
              Join
          </Button>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Navigation);