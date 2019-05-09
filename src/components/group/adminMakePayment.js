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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <h2>Make the payment</h2>
        <p>This section is only visible to you and will be unlocked once all user have committed to the payment.</p>
        <p>Once the button is unlocked and you press it there is no going back, the money will be transferred to the merchants account.</p>
        <Button onClick={this.handleClickOpen} disabled={!this.state.readyToMakePayment} variant="contained" color="secondary" className={classes.button}>
          MAKE PAYMENT
        </Button>
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
              Make the payment?
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
      </div>
    );
  }
}

export default withStyles(styles)(AdminMakePayment);