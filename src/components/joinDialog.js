import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import history from "./history";

const styles = theme => ({
  button: {
    marginTop: 20
  }, 
  loading: {
    width: '100%',
    textAlign: 'center',
    padding: '30px 0 20px'
  }
})

class AlertDialogSlide extends React.Component {
  state = {
    open: false,
    loading: false,
    error: {
      code: null,
      message: null
    }
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  joinGroup = () => {
    this.setState({ loading: true });
    const id = this.props.value;
    console.log(this.props);
    axios.post(`/api/group/${id}`)
      .then(res => {
        if (res.status === 200) {
          console.log(res)
          history.push(`/group`)
        } else {
          this.setState({
            error: {
              code: res.status,
              message: res.data
            }
          })
        }
      })
      .catch(error => this.setState({
        error: error
      }));
      
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button className={classes.button} variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Join Group
        </Button>
        <Dialog
          open={this.state.open}
          keepMounted
          onClose={this.handleClose}
          fullWidth
          disableBackdropClick={(this.state.loading)}
          disableEscapeKeyDown={(this.state.loading)}
          aria-labelledby="Confirm join group"
          aria-describedby="Confirmation dialog to join a group">
          <DialogTitle id="alert-dialog-slide-title">
            {(this.state.loading) ? 'Loading...' : 'Confirm'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {(this.state.loading) ? 'Contacting the backend service to join the Group.' : 'Are you sure you want to join the specified Group?' }
            </DialogContentText>
            {
            (this.state.loading) ?
                  <div className={classes.loading}>
                    <CircularProgress />
                    <DialogTitle id="alert-dialog-slide-title">
                      {(this.state.error.code || this.state.error.message) ? 'Error joining group' : ''}
                    </DialogTitle>
                    <DialogContentText id="alert-dialog-description">
                      {(this.state.error.code) ? `Code: ${this.state.error.code}` : null}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                      {(this.state.error.message) ? `Message: ${this.state.error.message}` : null}
                    </DialogContentText>
                  </div>
            : <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  No
                </Button>
                <Button onClick={this.joinGroup} variant="outlined" color="primary">
                  Yes
                </Button>
              </DialogActions>
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AlertDialogSlide);