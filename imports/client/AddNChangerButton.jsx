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
import AddIcon from '@material-ui/icons/Add';

const styles = {
  root: {

  },
  button: {
    backgroundColor: '#41b53f'
  }
};

//
class AddNChangerButton extends Component {
  state = {
    showNchangerSelectDialog: false,
    nchangerMail: ''
  }

  openDialog = () => {
    this.setState({showNchangerSelectDialog: true});
  }

  handleMailChange = (e) => {
    this.setState({nchangerMail: e.target.value});
  }

  handleClose = ( ) => {
    this.setState({showNchangerSelectDialog: false, nchangerMail: ''});
  }

  handleOk = ( ) => {
    const { nchangerMail } = this.state;
    this.props.onSelect(nchangerMail);
    this.handleClose();
  }

  render() {
    const { classes } = this.props;
    const { nchangerMail, showNchangerSelectDialog } = this.state;

    return (
      <div className={ classes.root }>
        <IconButton className={classes.button} onClick={this.openDialog}>
          <AddIcon fontSize= 'large'/>
        </IconButton>
        <Dialog open={showNchangerSelectDialog} onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Seleccionar Nchanger</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingresá el email del Nchanger
            </DialogContentText>
            <TextField value={nchangerMail} onChange={this.handleMailChange}
              autoFocus margin="dense" id="name" label="Email"
              type="text" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
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

export default withStyles(styles)(AddNChangerButton);
