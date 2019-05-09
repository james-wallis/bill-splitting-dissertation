import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const splitMethods = ['CUSTOM', 'EVEN']

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

class AdminOptionsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.amount,
      amountValid: true,
      method: props.method,
      error: null
    };
  }

  updateAdmin = () => {
    const amount = this.state.amount;
    const method = this.state.method;
    this.props.socket.emit('admin-options', {
      amount: amount,
      method: method
    });
  }

  handleChange = name => event => {
    if (name === 'amount') {
      // ensure that the amount is valid
      const regex = /^[1-9]\d*(?:\.\d{0,2})?$/;
      const result = regex.test(event.target.value);
      this.setState({ amountValid: result });
    } 
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { amountValid } = this.state;
    return (
      <div className={classes.root}>
        <h2>Admin options</h2>
        <p>Only you can change the amount and split method.</p>
        <Grid container spacing={24} className={classes.gridContainer}>
          <Grid item xs={6} sm={4}>
              <TextField
                error={!amountValid}
                id="full-amount"
                label="Full Amount"
                className={classes.textField}
                margin="normal"
                value={this.state.amount}
                onChange={this.handleChange('amount')}
              />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="split-method">
                Split method
              </InputLabel>
              <NativeSelect value={this.state.method}
                onChange={this.handleChange('method')} input={<Input name="split-method" id="split-method" />} >
                {splitMethods.map((method, key) => (
                  <option className={classes.options} key={key} value={method}>{method}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.buttonContainer}>
            <Button variant="contained" disabled={!amountValid} onClick={this.updateAdmin}>
              Update
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AdminOptionsTable);