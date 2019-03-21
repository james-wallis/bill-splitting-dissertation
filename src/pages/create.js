import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import history from "../components/history";

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

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupURL: null,
      error: null
    };
    this.checkUserInGroup();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  checkUserInGroup = () => {
    console.log('checkUser');
    axios.get(`/api/group/`)
      .then(res => {
        console.log(res);
        if (res.status !== 200) throw new Error(res);
        console.log(res);
        return res.data;
      })
      .then(data => {
        console.log(data)
        if (data.inGroup) {
          this.setState({ groupURL: data.endpoint })
        }
      })
      .catch(error => this.setState({
        error: error
      }));
  }

  createGroup = () => {
    axios.post(`/api/group/`)
      .then(res => {
        if (res.status !== 200) throw new Error(res);
        console.log(res);
        return res.data;
      })
      // .then(endpoint => this.setState({ groupURL: endpoint}))
      .then(endpoint => history.push(`/group${endpoint}`))
      .catch(error => this.setState({
        error: error
      }));
  }

  render() {
    const { classes } = this.props;
    const error = this.state.error;
    const existingURL = `/group${this.state.groupURL}`;
    return (
      <main className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Create New Split Payment
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component ="p">
            Create a Group and then share its link with other payees.
          </Typography>
          <Grid container spacing={32} justify="space-evenly" className={classes.container}>
            <Grid item xs className={classes.grid}>
              {
                (this.state.groupURL) 
                ? (
                    <Typography variant="subtitle2" align="center" color="textSecondary" component="p">
                      You are already a member of a group and are unable to join another.
                      The group is located at endpoint <Link to={existingURL}>{existingURL}</Link>
                    </Typography>
                )
                : <Button onClick={this.createGroup} variant="outlined" >Create</Button>
              }
              {(error) ? <p>Error creating item -> {error}</p> : null }
            </Grid>
          </Grid>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Group);