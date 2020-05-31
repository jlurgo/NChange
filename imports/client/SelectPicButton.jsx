import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';
import 'react-html5-camera-photo/build/css/index.css';

import Camera from 'react-html5-camera-photo';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CloseIcon from '@material-ui/icons/Close';


const styles = {
  root: {

  },
  cameraContainer: {
    zoom: '0.5',
    borderRadius: '30px',
    overflow: 'hidden',
  },
  previewContainer: {
    position: 'relative',
  },
  picPreview: {
    width: '100%',
    height: '100%',
    borderRadius: '15px',
  },
  discardButton: {
    position: 'absolute',
    top: '10px',
    right: '10px'
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
    this.setState({newPicUrl: e.target.value, newPicData: e.target.value});
  }

  handleTakePhoto = (pic_uri) => {
    console.log('pic length: ', pic_uri.length);
    this.setState({newPicData: pic_uri});
  }

  handleClose = () => {
    this.setState({showAddPictureDialog: false, newPicData: '', newPicUrl: ''});
  }

  handleOk = () => {
    const { newPicData } = this.state;
    this.props.onSelect(newPicData);
    this.handleClose();
  }

  discardPic = () => {
    this.setState({newPicData: '', newPicUrl: ''});
  }

  render() {
    const { classes } = this.props;
    const { newPicUrl, newPicData, showAddPictureDialog } = this.state;

    return (
      <div>
        <IconButton className={classes.button} onClick={this.openDialog}>
          <AddAPhotoIcon fontSize= 'medium'/>
        </IconButton>
        <Dialog open={showAddPictureDialog} onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Agregar imágen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              sacá una foto o ingresá la URL de una imágen
            </DialogContentText>
            {newPicData ?
              <div className={classes.previewContainer}>
                <img className={classes.picPreview} src={newPicData}/>
                <IconButton className={classes.discardButton}
                  onClick={this.discardPic}>
                  <CloseIcon fontSize='medium'/>
                </IconButton>
              </div>
              :
              <div className={classes.cameraContainer}>
                <Camera
                  onTakePhotoAnimationDone={this.handleTakePhoto}
                  idealResolution={{width: 200, height: 200 }}
                  imageType='jpg' isImageMirror={true}
                  idealFacingMode='environment'
                />
              </div>
            }
            <TextField value={newPicUrl} onChange={this.handleUrlChange}
              margin="dense" id="name" placeholder="URL de la imágen"
              variant= "outlined" type="text" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOk} color="primary" disabled={!newPicData}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(SelectPicButton);
