import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  appBar: {
    position: 'relative',
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
    const { classes, lead, members } = this.props;
    return (
      <div>
        <h2>Group details</h2>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Amount (£)</TableCell>
              <TableCell align="right">Tip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">{`${lead.name.first} ${lead.name.last}`}</TableCell>
              <TableCell align="right">{(lead.amount) ? `£${lead.amount}` : '£0.00'}</TableCell>
              <TableCell align="right">{(lead.tip) ? `£${lead.tip}` : '£0.00'}</TableCell>
            </TableRow>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell component="th" scope="row">
                  {`${member.name.first} ${member.name.last}`}
                </TableCell>
                <TableCell align="right">{(member.amount) ? `£${member.amount}` : '£0.00'}</TableCell>
                <TableCell align="right">{(member.tip) ? `£${member.tip}` : '£0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);