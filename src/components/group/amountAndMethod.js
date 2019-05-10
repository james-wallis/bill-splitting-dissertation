import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 30,
    textAlign: 'center'
  },
  gridContainer: {
    alignItems: 'center'
  }
});

class AmountAndMethod extends Component {
  render() {
    const { classes, amount, method } = this.props;
    return (
      <div className={classes.root}>
        <h2>Payment details</h2>
        <Grid container spacing={24} className={classes.gridContainer}>
          <Grid item xs={6} sm={6}>
            <Typography className={classes.invite} variant="body1" align="center" color="textSecondary" component="p">
              Total Amount: &pound;{amount}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography className={classes.invite} variant="body1" align="center" color="textSecondary" component="p">
              Split Method: {method}
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AmountAndMethod);