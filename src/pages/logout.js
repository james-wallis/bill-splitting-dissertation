import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  container: {
    marginTop: 50
  },
  grid: {
    textAlign: 'center'
  },
  link: {
    textDecoration: 'none'
  }
});

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupLeft: false,
      loggedOut: false,
      error: null
    };
  }

  leaveGroup = () => {
    axios.delete(`/api/group`)
      .then(res => {
        if (res.status !== 200) throw new Error(res);
        this.setState({
          groupLeft: true
        })
        this.logout();
      })
      .catch(error => this.setState({
        error: error
      }));
  }

  logout = () => {
    axios.post(`/api/auth/logout`)
      .then(res => {
        if (res.status !== 200) throw new Error(res);
        this.setState({
          loggedOut: true
        })
      })
      .catch(error => this.setState({
        error: error
      }));
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Logout.
          </Typography>
          <Grid container spacing={32} justify="space-evenly" className={classes.container}>
            <Grid item xs className={classes.grid}>
              {
                (this.state.groupLeft && this.state.loggedOut)
                  ? (
                    <Typography variant="subtitle2" align="center" color="textSecondary" component="p">
                      You have logged out and can now close this window.
                    </Typography>
                  )
                  : <Button onClick={this.leaveGroup} variant="outlined" >Press here to logout.</Button>
              }
            </Grid>
          </Grid>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Logout);