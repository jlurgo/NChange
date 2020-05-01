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
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const styles = {
  root: {

  },
  button: {
    
  }
};

//
class SelectPicButton extends Component {
  state = {
    showAddPictureDialog: false,
    newPicUrl: ''
  }

  openDialog = () => {
    this.setState({showAddPictureDialog: true});
  }

  handleUrlChange = (e) => {
    this.setState({newPicUrl: e.target.value});
  }

  handleClose = ( ) => {
    this.setState({showAddPictureDialog: false, newPicUrl: ''});
  }

  handleOk = ( ) => {
    const { newPicUrl } = this.state;
    this.props.onSelect(newPicUrl);
    this.handleClose();
  }

  render() {
    const { classes } = this.props;
    const { newPicUrl, showAddPictureDialog } = this.state;

    return (
      <div className={ classes.root }>
        <IconButton className={classes.button} onClick={this.openDialog}>
          <AddAPhotoIcon fontSize= 'large'/>
        </IconButton>
        <Dialog open={showAddPictureDialog} onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar imágen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingresá la URL de la imágen
            </DialogContentText>
            <TextField value={newPicUrl} onChange={this.handleUrlChange}
              autoFocus margin="dense" id="name" label="Email Address"
              type="text" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
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

export default withStyles(styles)(SelectPicButton);
