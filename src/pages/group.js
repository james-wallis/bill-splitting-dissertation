import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import GroupTable from '../components/groupTable';
import AdminOptions from '../components/adminOptionsTable';

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

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
      error: null,
      lead: false
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
      this.setupSocket();
    }
  }

  setupSocket() {
    const socketPath = this.state.group.socketNamespace;
    const socket = io(`http://localhost:3001${socketPath}`);
    socket.on('connect', () => {
      console.log('connection');
    });
    socket.on('disconnect', () => { });
    socket.on('member-added', (data) => {
      console.log('New member has joined the group');
      console.log(data);
      // Update the state
    })
    socket.on('group-details', (data) => {
      console.log('group-details')
      console.dir(this)
      console.log(this.state.group)
      // this.state.group = data;
    })
    socket.on('lead-status', (isLead) => {
      // If Admin set state admin to true
      console.log('isLead', isLead);
      this.setState({
        lead: isLead
      })
    })
  }

  render() {
    const { classes } = this.props;
    const { group } = this.state;
    const ownership = ((group.leadMember && group.leadMember.name.last.slice(-1) === 's') ? '\'' : '\'s');
    return (
      <main className={classes.layout}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            {(group.leadMember) ? `${group.leadMember.name.first} ${group.leadMember.name.last}${ownership} Group` : 'Welcome'}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            You have successfully joined 
            {(group.leadMember) ? ` ${group.leadMember.name.first} ${group.leadMember.name.last}${ownership} split the bill group. ` : ' the split the bill group. '}
            You can now adjust the amount that you owe, add a tip and invite other members of group.
          </Typography>
          <Typography className={classes.invite} variant="body1" align="center" color="textSecondary" component="p">
            Invite other members using the link:
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" component="p">
            {(group.endpoint) ? ` ${window.location.origin}/join?group=${group.endpoint}` : ' '}
          </Typography>
        </div>
        {(this.state.group.id) ? (
          <div>
            <AdminOptions />
            {/* <Display /> */}
            <GroupTable lead={this.state.group.leadMember} members={this.state.group.otherMembers} /> 
          </div>
        ): null}
      </main>
    );
  }
}

export default withStyles(styles)(Group);