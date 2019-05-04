import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 30,
  },
  gridContainer: {
    alignItems: 'center'
  },
  buttonContainer: {
    textAlign: 'center'
  },
  options: {
    textTransform: 'capitalize'
  }
});

class UserOptions extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      amount: '',
      amountValid: true,
      tip: '',
      tipValid: true,
      error: null
    };
  }

  handleChange = (name, valid) => event => {
    // ensure that the amount is valid
    const regex = /^[1-9]\d*(?:\.\d{0,2})?$/;
    const val = (event.target.value && parseFloat(event.target.value)) ? parseFloat(event.target.value) : '';
    let result = true;
    if (name === 'amount') {
      const { totalAmount } = this.props;
      result = (regex.test(val) && val <= totalAmount && val > 0);
    } else {
      result = (val > 0)
    }
    this.setState({
      [name]: val,
      [valid]: result
    });
  };
  
  updateUser = () => {
    const { amount, tip } = this.state;
    this.props.socket.emit('user-amount', amount, tip);
    this.setState({
      amount: '',
      amountValid: true,
      tip: '',
      tipValid: true
    });
  }

  render() {
    const { classes } = this.props;
    const { amountValid, tipValid } = this.state;
    return (
      <div className={classes.root}>
        <h2>Your options</h2>
        <p>Enter the amount you are willing to pay and tip.</p>
        <Grid container spacing={24} className={classes.gridContainer}>
          <Grid item xs={6} sm={4}>
            <TextField
              error={!amountValid}
              id="amount"
              label="Amount"
              className={classes.textField}
              margin="normal"
              value={this.state.amount}
              onChange={this.handleChange('amount', 'amountValid')}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              error={!tipValid}
              id="tip"
              label="Tip"
              className={classes.textField}
              margin="normal"
              value={this.state.tip}
              onChange={this.handleChange('tip', 'tipValid')}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.buttonContainer}>
            <Button variant="contained" disabled={!amountValid} onClick={this.updateUser}>
              Update
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(UserOptions);