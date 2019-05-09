import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

class PaymentBeingProcessed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    const { classes, status } = this.props;
    return (
      <Typography>
        Payment is being processed {status}
      </Typography>
    );
  }
}

export default withStyles(styles)(PaymentBeingProcessed);