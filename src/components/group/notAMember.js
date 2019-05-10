import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  }
});

class DisplayGroup extends Component {
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
      <div className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Sorry
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          You're not a member of a group.
        </Typography>
        <Typography className={classes.invite} variant="body1" align="center" color="textSecondary" component="p">
          Use the links in the header to either create or join a group.
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(DisplayGroup);