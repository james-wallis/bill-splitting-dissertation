import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Done from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
const styles = theme => ({
  div: {
    textAlign: 'center'
  }
});

class PaymentBeingProcessed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lead_money_sent: false,
      lead_money_received: false,
      merchant_money_sent: false,
      payment_completed: false,
      error: false
    };

    props.socket.on('payment-status', (status, error) => {
      switch (status) {
        case 'lead-money-sent':
          this.setState({ lead_money_sent: true });
          break;
        case 'lead-money-received':
          this.setState({ lead_money_received: true });
          break;
        case 'merchant-money-sent':
          this.setState({ merchant_money_sent: true });
          break;
        default:
          console.log('Status unknown', status);
          if (error) this.setState({ error: error })
      }
    })
    props.socket.on('group-closed', () => {
      this.setState({ payment_completed: true });
    })
  }

  render() {
    const { classes } = this.props;
    const { lead_money_sent, lead_money_received, merchant_money_sent, payment_completed, error } = this.state;
    return (
      <div className={classes.div}>
        {(!payment_completed)
        ?
        <div>
          <h2>Payment is being processed</h2>
          {(error)
            ?
            <div>
              <p>Error making payment</p>
              <p>{error}</p>
            </div>
            :
            <div>
              <p>Sending individual amounts to the Lead member (Groups creator) {(lead_money_sent) ? <Done /> : '...'}</p>
              <p>Verifying the Lead member has received the money {(lead_money_received) ? <Done /> : '...'}</p>
              <p>Sending the total to the merchant {(merchant_money_sent) ? <Done /> : '...'}</p>
              <CircularProgress /> 
            </div>}
          </div>
          : 
          <div>
            <h2>Payment completed</h2>
            <p>The payment has been successfully completed and the full amount sent to the merchant.</p>
            <p>This group has been deleted.</p>
            <p>Click the button below to log out.</p>
            <Link to="/logout" >
              <Button variant="outlined" color="primary">
                Logout
              </Button>
            </Link>
            
          </div>}
      </div>
    );
  }
}

export default withStyles(styles)(PaymentBeingProcessed);