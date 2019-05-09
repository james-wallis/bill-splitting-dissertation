import React, { Component } from 'react';
import io from 'socket.io-client';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import GroupTable from './groupTable';
import AdminOptions from './adminOptionsTable';
import AmountAndMethod from './amountAndMethod';
import UserOptions from './userOptions';
import Summary from './summary';
import MakePayment from './adminMakePayment';
import PaymentBeingProccessed from './paymentBeingProcessed';

const styles = theme => ({
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  }
});

class DisplayGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      user: {
        payment: null
      },
      isLead: false,
      error: null,
      disableYourOptions: false,
      paymentStatus: null
    };
    this.setupSocket();
  }

  setupSocket = () => {
    const { group } = this.state;
    const socketPath = group.socketNamespace;
    this.socket = io(`http://localhost:3001${socketPath}`);
    const socket = this.socket;
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
      this.setState({
        group: data
      })
    })
    socket.on('user-details', data => {
      console.log('user-details');
      console.log(data);
      this.setState({
        user: data
      })
    })
    socket.on('lead-status', isLead => {
      // If Admin set state admin to true
      console.log('isLead', isLead);
      this.setState({
        isLead: isLead
      })
    })
    socket.on('payment-status', (status, error) => {
      console.log('payment-status received', status);
      if (error) console.error(error);
      this.setState({
        paymentStatus: status
      })
    })
  }

  toggleYourOptions = (toggle) => {
    console.log('toggle', toggle);
    this.setState({
      disableYourOptions: toggle
    })
  }

  render = () => {
    const { classes } = this.props;
    const { group, isLead, disableYourOptions, user } = this.state;
    const ownership = ((group.leadMember && group.leadMember.name.last.slice(-1) === 's') ? '\'' : '\'s');
    return (
      <div>
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
        {(this.state.paymentStatus)
        ? 
          <PaymentBeingProccessed status={this.state.paymentStatus}/>
        :
          <div>
            {/* If user is Admin show the options else just show each users the amount and method used in payment */}
            {(isLead) ? <AdminOptions socket={this.socket} amount={group.amount} method={group.method} /> : <AmountAndMethod amount={group.amount} method={group.method} />}
            {/* <Display /> */}
            <Divider />
            <UserOptions disabled={disableYourOptions} totalAmount={group.amount} currentUserAmounts={user.payment} socket={this.socket} />
            <Divider />
            <Summary togglePayment={this.toggleYourOptions} socket={this.socket} totalToPay={group.amount} lead={group.leadMember} members={group.otherMembers} />
            <GroupTable lead={group.leadMember} members={group.otherMembers} />
            {(isLead) ? <MakePayment socket={this.socket} groupID={group.id} /> : null}
          </div>
        }
        
      </div>
    );
  }
}

export default withStyles(styles)(DisplayGroup);