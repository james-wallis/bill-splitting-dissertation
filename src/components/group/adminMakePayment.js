import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 200,
    // marginTop: -80
  },
  gridContainer: {
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    textAlign: 'center',
    width: '100%',
    height: '80px',
    marginTop: '30px'
  },
  options: {
    textTransform: 'capitalize'
  }
});

class AdminMakePayment extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.groupID = props.groupID;
    this.state = {
      readyToMakePayment: false,
      error: null,
      open: false,
    };

    this.socket.on('change-payment-ready-status', status => {
      this.setState({
        readyToMakePayment: status
      })
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  paymentButtonPressed = () => {
    this.socket.emit('initiate-payment', this.groupID);
  }

  render() {
    const { classes, totalToPay, totalAmount, totalTip } = this.props;
    const differenceBetweenTotals = totalToPay - totalAmount;
    return (
      <div className={classes.root}>
        <h2>Make the payment</h2>
        <p>This section is only visible to you and will be unlocked once all user have committed to the payment.</p>
        <p>Once the button is unlocked and you press it there is no going back, the money will be transferred to the merchants account.</p>
        <Button onClick={this.handleClickOpen} disabled={!this.state.readyToMakePayment} variant="contained" color="secondary" className={classes.button}>
          MAKE PAYMENT
        </Button>
        {
          (differenceBetweenTotals > 0 || totalAmount === 0) 
          ?
        <Dialog
          open={this.state.open}
          keepMounted
          onClose={this.handleClose}
          fullWidth
          aria-labelledby="Instruct more to pay"
          aria-describedby="Dialog to inform the lead user there is more money to pay">
          <DialogTitle id="alert-dialog-slide-title">
            {(totalAmount === 0) ? 'Need to set amount to pay.' : 'Need to add more money.'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {(totalAmount !== 0) ? 
              'The total amount that you\'re group has pledged is less than the total bill amount. Please discuss adding additional funding to the group payment with other members of the group.'
              : 'You need to add the amount you wish to pay before the payment can work. See the "admin options" section at the top of the screen.'}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
                  {(totalAmount !== 0) ? `Another &pound;${differenceBetweenTotals} is required.` : null}
            </DialogContentText>
            <DialogActions>
            <Button onClick={this.handleClose} variant="outlined" color="primary">
                Close
            </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
          :
        <Dialog
          open={this.state.open}
          keepMounted
          onClose={this.handleClose}
          fullWidth
          aria-labelledby="Confirm make payment"
          aria-describedby="Confirmation dialog to make the payment">
          <DialogTitle id="alert-dialog-slide-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Make the payment of &pound;{totalAmount} and a tip amount of &pound;{totalTip}?
            </DialogContentText>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                No
            </Button>
              <Button onClick={this.paymentButtonPressed} variant="outlined" color="primary">
                Yes
            </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        }
      </div>
    );
  }
}

export default withStyles(styles)(AdminMakePayment);