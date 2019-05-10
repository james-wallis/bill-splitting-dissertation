import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import NotAMember from '../components/group/notAMember';
import DisplayGroup from '../components/group/displayGroup';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  container: {
    marginTop: 50
  },
  grid: {
    textAlign: 'center'
  },
  link: {
    textDecoration: 'none'
  },
  invite: {
    marginTop: 20
  }
});

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      error: null,
      lead: false
    }
    this.socket = null;
    axios.get(`/api/group`)
      .then(res => {
        console.log(res)
        if (res.status !== 200) throw new Error(res);
        return res;
      })
      .then(res => this.setState({group: res.data}))
      .catch(error => this.setState({
        error: error
      }));
  }

  render() {
    const { classes } = this.props;
    const { group } = this.state;
    console.log(group);
    return (
      <main className={classes.layout}>
        {(group) ? <DisplayGroup group={group} /> : <NotAMember />}
      </main>
    );
  }
}

export default withStyles(styles)(Group);