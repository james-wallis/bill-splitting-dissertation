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
  },
  pledged: {
    // textAlign: '',
    fontSize: '12px'
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
    const regex = /^([1-9]\d*|0)(?:\.\d{0,2})?$/;
    const prevValue = this.state[name];
    let newValue = event.target.value;
    let result = regex.test(newValue) || newValue === '';
    if (result && newValue !== '' && newValue[newValue.length -1] !== '.') newValue = parseFloat(newValue);
    console.log('result', result);

    this.setState({
      [name]: ((result) ? newValue : prevValue),
      [valid]: result
    });
  };
  
  updateUser = () => {
    const { amount, tip } = this.state;
    console.log('amount, tip, ', amount, tip);
    this.props.socket.emit('user-amount', amount, tip);
    this.setState({
      amount: '',
      amountValid: true,
      tip: '',
      tipValid: true
    });
  }

  render() {
    const { classes, disabled, currentUserAmounts, method } = this.props;
    const { amountValid, tipValid } = this.state;
    const currentUserAmount = (currentUserAmounts && currentUserAmounts.amount) ? currentUserAmounts.amount : 0;
    const currentUserTip = (currentUserAmounts && currentUserAmounts.tip) ? currentUserAmounts.tip : 0;
    const currentUserTotal = currentUserAmount + currentUserTip;
    const currentUserFundsAvailable = (currentUserAmounts && currentUserAmounts.available) ? currentUserAmounts.available : 'N/A';
    const currentUserCanAfford = (currentUserAmounts && currentUserAmounts.canAffordPayment) ? 'Yes' : 'No';
    return (
      <div className={classes.root}>
        <h2>Your options</h2>
        <p>Enter the amount you are willing to pay and tip.</p>
        <Grid container spacing={24} className={classes.gridContainer}>
        {(method === 'CUSTOM')
        ?  
          <Grid item xs={6} sm={3}>
            <TextField
              error={!amountValid}
              id="amount"
              label="Amount"
              className={classes.textField}
              margin="normal"
              value={this.state.amount}
              onChange={this.handleChange('amount', 'amountValid')}
              disabled={disabled}
            />
          </Grid>
        :
          <Grid item xs={6} sm={3}>
            <p>Bill is being split evenly.</p>
            <p>Amount you will pay &pound;{(currentUserAmount) ? currentUserAmount : 0}</p>
          </Grid>
        }
          
          <Grid item xs={6} sm={3}>
            <TextField
              error={!tipValid}
              id="tip"
              label="Tip"
              className={classes.textField}
              margin="normal"
              value={this.state.tip}
              onChange={this.handleChange('tip', 'tipValid')}
              disabled={disabled}
            />
          </Grid>
          <Grid container item xs={12} sm={6} className={classes.buttonContainer}>
            <Grid item xs={12} sm={12} className={classes.pledged}>
              <h3>Your summary</h3>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.pledged}>
              <p className={classes.pledged}>Pledged amount: &pound;{currentUserAmount}</p>
              <p className={classes.pledged}>Pledged tip: &pound;{currentUserTip}</p>
              <p className={classes.pledged}>Total: &pound;{currentUserTotal}</p>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.pledged}>
              <p className={classes.pledged}>Amount available in your account: &pound;{currentUserFundsAvailable}</p>
              <p className={classes.pledged}>Amount available after transaction: &pound;{currentUserFundsAvailable - currentUserTotal}</p>
              <p className={classes.pledged}>Able to make payment: {currentUserCanAfford}</p>
            </Grid>
            <Grid item xs={12} sm={12} className={classes.pledged}>
              <Button variant="contained" disabled={!amountValid || disabled} onClick={this.updateUser}>
                Update
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            {(disabled) 
            ? <p>To re-enable this section, uncheck the "commit to payment" box at the bottom.</p> 
            : <p>Once you're happy with the amount you will pay and tip, check the "commit to payment" box at the bottom.</p>}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(UserOptions);