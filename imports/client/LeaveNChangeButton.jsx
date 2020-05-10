import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = {
  root: {

  },
  button: {
    backgroundColor: 'red'
  }
};

//
class LeaveNChangeButton extends Component {

  state = {
    showConfirmDialog: false
  }

  openDialog = () => {
    this.setState({showConfirmDialog: true});
  }

  closeDialog = ( ) => {
    this.setState({showConfirmDialog: false});
  }

  handleOk = ( ) => {
    const { nchange_id, history } = this.props;
    Meteor.call('nchanges.leave', nchange_id);
    this.closeDialog();
    history.push(`/nchanges`)
  }

  render() {
    const { classes } = this.props;
    const { showConfirmDialog } = this.state;

    return (
      <div className={ classes.root }>
        <IconButton className={classes.button} onClick={this.openDialog}>
          <ExitToAppIcon fontSize= 'large'/>
        </IconButton>
        <Dialog open={showConfirmDialog} onClose={this.closeDialog}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">¿Abandonar nChange?</DialogTitle>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(LeaveNChangeButton));
