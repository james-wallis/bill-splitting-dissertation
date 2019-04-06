import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

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
  }
});

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: null
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        Group options
        <Grid container spacing={24} className={classes.gridContainer}>
          <Grid item xs={6} sm={4}>
              <TextField
                id="full-amount"
                label="Full Amount"
                className={classes.textField}
                margin="normal"
              />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="split-method">
                Split method
            </InputLabel>
              <NativeSelect
                value={this.state.age}
                input={<Input name="split-method" id="split-method" />}
              >
                <option value="individual">Individual</option>
                <option value="equal">Equal</option>
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.buttonContainer}>
            <Button variant="contained">
              Update
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);