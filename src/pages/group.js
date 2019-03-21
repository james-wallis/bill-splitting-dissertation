import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import StarlingName from '../components/starlingName';
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
  },
  invite: {
    marginTop: 20
  }
});

class Group extends Component {
  constructor(props) {
    super(props);
    console.log(props.match.params.id);
    this.state = {
      group: {},
      error: null
    }
    axios.get(`/api/group/${props.match.params.id}`)
      .then(res => {
        if (res.status !== 200) throw new Error(res);
        return res;
      })
      .then(res => this.setState({group: res.data}))
      .catch(error => this.setState({
        error: error
      }));
  }

  componentDidUpdate() {
    if (this.state.group.socketNamespace) {
      const socketPath = this.state.group.socketNamespace;
      const socket = io(`http://localhost:3001${socketPath}`);
      socket.on('connect', function () {
        console.log('connection');
      });
      socket.on('event', function (data) { });
      socket.on('disconnect', function () { });
    }
  }

  render() {
    console.log(this.state)
    const { classes } = this.props;
    const { error, group } = this.state;
    // return (
    //   <div id='group-individual'>
    //     {/* {(group.leadMember) ? <h1>Splitting with {group.leadMember.firstname} {group.leadMember.lastname}</h1> : null} */}
    //     <StarlingName />
    //   </div>
    // );
    return (
      <main className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            {(group.leadMember) ? `${group.leadMember.firstname} ${group.leadMember.lastname}'s group` : 'Welcome'}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            You have successfully joined 
            {(group.leadMember) ? ` ${group.leadMember.firstname} ${group.leadMember.lastname}'s split the bill group. ` : ' the split the bill group. '}
            You can now adjust the amount that you owe, add a tip and invite other members of group.
          </Typography>
          <Typography className={classes.invite} variant="body1" align="center" color="textSecondary" component="p">
            Invite other members using the link:
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" component="p">
            {window.location.href}
          </Typography>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Group);