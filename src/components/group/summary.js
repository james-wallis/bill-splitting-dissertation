import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    flexGrow: 1,
    // marginBottom: 100,
    // marginTop: 30
  },
  gridContainer: {
    alignItems: 'center',
    textAlign: 'center'
  },
  buttonContainer: {
    textAlign: 'center'
  },
  options: {
    textTransform: 'capitalize'
  }
});

class Summary extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      committed: false,
      error: null
    };
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

  commitToPayment = (event) => {
    this.setState({
      committed: event.target.checked
    })
    this.props.togglePayment(event.target.checked);
    this.socket.emit('commit-to-payment', event.target.checked);
  }

  render() {
    const { classes, lead, members, totalToPay } = this.props;
    const { totalAmount, totalTip } = this.calculateTotal(lead, members);
    const differenceBetweenTotals = totalToPay - totalAmount;
    const amountLeftColor = (differenceBetweenTotals > 0) ? 'red' : 'green';
    let amountLeftText = 'Perfect';
    if (differenceBetweenTotals > 0) amountLeftText = 'More to pay';
    if (differenceBetweenTotals < 0) amountLeftText = 'Overpaid';
    return (
      <div className={classes.root}>
        <h2>Group Summary</h2>
        <p>The total amounts that will be paid.</p>
        <Grid container spacing={24} className={classes.gridContainer}>
          <Grid item xs={12} sm={3}>
            <p>Total that will be paid:</p>
            <p>&pound; {totalAmount}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
            <p>Amount left to pay:</p>
            <p style={{ color: amountLeftColor }}>&pound; {differenceBetweenTotals}</p>
            <p>{amountLeftText}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
            <p>Total that will be tipped:</p>
            <p>&pound; {totalTip}</p>
          </Grid>
          <Grid item xs={12} sm={3} className={classes.buttonContainer}>
            <p>Commit to payment</p>
            <p style={{ fontSize: '12px' }}>
              When you are happy with the amount you will pay, 
              please check the box below to show the lead member that you are ready to pay.
            </p>
            <p style={{ fontSize: '12px' }}>
              If you would like to make another change to the 
              amount you wish to pay or the tip, uncheck the tick 
              box and the "Your options" section will be unlocked again.
            </p>
            <Checkbox
              checked={this.state.checked}
              onChange={this.commitToPayment}
              value="checked"
              color="primary"
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Summary);