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

import NChangerList from './NChangerList';


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
    searchTerm: ''
  }

  openDialog = () => {
    this.setState({showNchangerSelectDialog: true});
  }

  handleSearchChange = (e) => {
    this.setState({searchTerm: e.target.value});
  }

  handleClose = ( ) => {
    this.setState({showNchangerSelectDialog: false, searchTerm: ''});
  }

  handleSelect = ( nchanger_id) => {
    this.props.onSelect(nchanger_id);
    this.handleClose();
  }

  render() {
    const { excludedNChangers, classes } = this.props;
    const { searchTerm, showNchangerSelectDialog } = this.state;

    return (
      <div className={ classes.root }>
        <IconButton className={classes.button} onClick={this.openDialog}>
          <AddIcon fontSize= 'small'/>
        </IconButton>
        <Dialog open={showNchangerSelectDialog} onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Seleccionar Nchanger</DialogTitle>
          <DialogContent>
            <TextField value={searchTerm} onChange={this.handleSearchChange}
              autoFocus margin="dense" id="name" label="nombre de usuario"
              type="text" variant="outlined" fullWidth/>
            <NChangerList onSelect={this.handleSelect}
              filter={{
                _id: { $nin: excludedNChangers},
                userName: {
                  $regex : `.*${searchTerm}.*`,
                  $options : 'i'
                }
              }
            }/>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddNChangerButton);
