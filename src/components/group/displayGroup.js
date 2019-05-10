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
      paymentStatus: null,
      group_closed: false
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
    socket.on('group-closed', () => {
      this.setState({ group_closed: true });
    })
  }

  toggleYourOptions = (toggle) => {
    console.log('toggle', toggle);
    this.setState({
      disableYourOptions: toggle
    })
  }

  calculateTotal = (lead, members) => {
    let totalAmount = 0;
    let totalTip = 0;
    totalAmount += lead.payment.amount;
    totalTip += lead.payment.tip;
    for (let i = 0; i < members.length; i++) {
      totalAmount += members[i].payment.amount;
      totalTip += members[i].payment.tip;
    }
    return { totalAmount, totalTip };
  }

  render = () => {
    const { classes } = this.props;
    const { group, isLead, disableYourOptions, user, group_closed, paymentStatus } = this.state;
    const ownership = ((group.leadMember && group.leadMember.name.last.slice(-1) === 's') ? '\'' : '\'s');
    const { totalAmount, totalTip } = this.calculateTotal(group.leadMember, group.otherMembers);
    return (
      <div>
        {
          (group_closed && !paymentStatus) 
          ?
          <div className={classes.heroContent}>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                The group has been closed.
              </Typography>
              <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Speak to the lead member to discuss why and use the create button to create a new one.
              </Typography>
          </div>
          :
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
                <PaymentBeingProccessed socket={this.socket} status={this.state.paymentStatus} />
                :
                <div>
                  {/* If user is Admin show the options else just show each users the amount and method used in payment */}
                  {(isLead) ? <AdminOptions socket={this.socket} amount={group.amount} method={group.method} /> : <AmountAndMethod amount={group.amount} method={group.method} />}
                  {/* <Display /> */}
                  <Divider />
                  <UserOptions disabled={disableYourOptions} totalAmount={group.amount} currentUserAmounts={user.payment} socket={this.socket} method={group.method} />
                  <Divider />
                  <Summary togglePayment={this.toggleYourOptions} socket={this.socket} totalToPay={group.amount} totalAmount={totalAmount} totalTip={totalTip} />
                  <GroupTable lead={group.leadMember} members={group.otherMembers} />
                  {(isLead) ? <MakePayment socket={this.socket} groupID={group.id} totalToPay={group.amount} totalAmount={totalAmount} totalTip={totalTip}/> : null}
                </div>
              }

            </div>}
          </div>
        
    );
  }
}

export default withStyles(styles)(DisplayGroup);