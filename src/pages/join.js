import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import JoinDialog from '../components/joinDialog';

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
  },
  input: {
    marginTop: 10
  }
});

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    const params = new URLSearchParams(this.props.location.search);
    let id = params.get('group');
    if (id && id !== '') {
      console.log(id)
      if (id.startsWith('/')) id = id.substr(1);
      this.state.value = id;
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.layout}>
        <div className={classes.heroContent}>
          <Grid container spacing={32} justify="space-evenly">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Join Group
          </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Join an existing bill splitting group. 
              The group members should provide you with 
              a unique ID (part of the URL) which you can 
              enter into the input box below.
          </Typography>
          </Grid>
          <Grid container spacing={32} justify="space-evenly" className={classes.container}>
            <InputLabel>Group ID</InputLabel>
            <TextField 
              className={classes.input} 
              fullWidth placeholder='Enter Group ID' 
              value={this.state.value} inputProps={{
                style: { textAlign: 'center' }
              }} 
              onChange={this.handleChange} />
            <JoinDialog value={this.state.value} />
          </Grid>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Join);