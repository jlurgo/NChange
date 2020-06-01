import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SwipeableViews from 'react-swipeable-views';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';

import TagBar from "./TagBar";
import SelectPicButton from "./SelectPicButton";
import TagSelectBar from './TagSelectBar';
import NChangerAvatar from "./NChangerAvatar";
import SelectQtyButton from "./SelectQtyButton";

import { Items } from "../shared/collections";
import NThing from "../shared/NThing";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    width: '700px',
    maxWidth: '98%',
  },
  topSection: {
    display: 'flex',
  },
  picsSection: {
    position: 'relative',
    flex: '1 1 30vh',
    overflow: 'hidden',
    width: '30vh'
  },
  picsList: {

  },
  picContainer: {
    position: 'relative'
  },
  pic: {
    width: '100%',
    height: '29vh',
    objectFit: 'cover',
  },
  controls: {
    flex: '0 0 50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  removePicIcon: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    color: 'red'
  },
  addPicIcon: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    color: 'blue'
  },
  propertySection: {
    display: 'flex',
    alignItems: 'center'
  },
  stockSection: {
    display: 'flex',
    marginBottom: '10px'
  },
  stockLabel: {
    marginRight: '10px'
  },
  descriptionInput: {
  },
  confirmationBar: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
};

//
class NThingDetail extends Component {

  state = {
    nThing: {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      nThing: nextProps.nThing,
    };
  }

  handleClose = () => {
    if(this.props.onClose) {
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  handleSave = () => {
    const { nThing } = this.state;
    nThing.save((error) => {
      if (error) {
        console.warn(error);
        return
      }
      this.handleClose();
    });
  }

  handleReceived = () => {
    const { nThing } = this.state;
    Meteor.call('nthings.markAsReceived', nThing._id, (error)=> {
      if (error) {
        console.warn(error);
        return
      }
    });
  }

  removePic = (pic) => {
    const { nThing } = this.state;
    nThing.pics = _.without(nThing.pics, pic);
    this.setState(nThing);
  }

  addPic = (pic) => {
    const { nThing } = this.state;
    if (!nThing.pics)
      nThing.pics = [];
    nThing.thumbnail = pic;
    nThing.pics.push(pic);
    this.setState(nThing);
  }

  updateTags = (tags) => {
    const { nThing } = this.state;
    nThing.tags = tags;
    this.setState(nThing);
  }

  updateStock  = (e) => {
    const { nThing } = this.state;
    nThing.stock = e.target.value;;
    this.setState(nThing);
  }

  updateLongDescription = (e) => {
    const { nThing } = this.state;
    nThing.longDescription = e.target.value;
    this.setState(nThing);
  }

  render() {
    const { nChange, nChangerId, loading,
      classes, history } = this.props;
    const { nThing } = this.state;
    if (loading) return <div>Loading...</div>

    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div className={classes.picsSection}>
            <SwipeableViews className={classes.picsList}>
              {nThing.pics && nThing.pics.map(this.renderPic)}
            </SwipeableViews>
          </div>
          <div className={classes.controls}>
            {this.renderCloseButton()}
            { nThing.canBeUpdatedByMe() &&
              <SelectPicButton onSelect={this.addPic}/>
            }
            { this.renderDeleteButton() }
            { nChange &&
              <SelectQtyButton nThing={nThing} nChange={nChange}
                nChangerId={nChangerId}/>
            }
          </div>
        </div>
        {
          nThing.canBeUpdatedByMe() ?
            <TagSelectBar selectedTags={nThing.tags}
              onTagsChange={this.updateTags}/> :
            <TagBar tags={nThing.tags}/>
        }
        <div className={classes.propertySection}>
          <Typography variant="h5" >
            Dueño:
          </Typography>
          <NChangerAvatar nChangerId={nThing.owner}/>
          {(nThing.owner !== nThing.guardian) &&
            <Typography variant="h5" >
              entrega:
            </Typography>
          }
          {(nThing.owner !== nThing.guardian) &&
            <NChangerAvatar nChangerId={nThing.guardian}/>
          }
        </div>
        <div className={classes.stockSection}>
          {
            nThing.canBeUpdatedByMe() ?
              <TextField defaultValue={nThing.stock} type="number"
                className={classes.stockInput} variant="outlined"
                onChange={this.updateStock} label="Stock"
              /> :
              <Typography variant="h5" className={classes.stockLabel} >
                Stock: {nThing.stock}
              </Typography>
          }
        </div>
        {
          nThing.canBeUpdatedByMe() ?
            <TextField defaultValue={nThing.longDescription} type="text"
              className={classes.descriptionInput} label="Descripción" multiline
              onChange={this.updateLongDescription} variant="outlined" fullWidth
            /> :
            <Typography variant="h6">
              {nThing.longDescription}
            </Typography>
        }
        <div className={classes.confirmationBar}>
          {
            !nThing._id &&
              <Button onClick={this.handleClose} color="secondary">
                Cancelar
              </Button>
          }
          {
            nThing.canBeUpdatedByMe() &&
              <Button onClick={this.handleSave} color="primary">
                Guardar
              </Button>
          }
        </div>
      </div>
    );
  }

  renderPic = (pic, i) => {
    const { classes } = this.props;
    const { nThing } = this.state;
    return  (
      <div className={classes.picContainer} key={i}>
        <img src={pic} alt={'picture'}
         className={classes.pic}/>
         { nThing.canBeUpdatedByMe() &&
           <IconButton className={classes.removePicIcon}
            onClick={() => this.removePic(pic)}>
              <DeleteForeverIcon fontSize= 'medium'/>
           </IconButton>
         }
      </div>
    );
  }

  renderCloseButton = () => {
    const { classes } = this.props;
    return (
      <IconButton className={classes.button} onClick={this.handleClose}>
         <CloseIcon fontSize= 'medium'/>
      </IconButton>
    );
  }

  renderDeleteButton = () => {
    const { classes, nChange } = this.props;
    const { nThing } = this.state;
    return nThing.canBeUpdatedByMe() && !nChange &&
      <IconButton className={classes.button + ' ' + classes.removeThingIcon}
        onClick={() => {
          nThing.archive()
        }}>
         <DeleteIcon fontSize= 'small'/>
      </IconButton>
  }
}

class NThingDetailDrawer extends Component {
  render() {
    console.log('drawing drawer', this.props);
    return(
      <Drawer open={this.props.open} onClose={this.props.onClose} anchor='right'
        PaperProps={{ style: { position: 'absolute', maxWidth: '100%'} }}
        BackdropProps={{ style: { position: 'absolute'} }}
        ModalProps={{
          container: document.getElementById('drawer-container'),
          style: { position: 'absolute', maxWidth: '100%', marginLeft: '5px',
              marginRight: '5px'}
        }}
        variant="temporary"
      >
        <NThingDetail {...this.props}/>
      </Drawer>
    );
  }
}

export default withRouter(withTracker((props) => {
  const thing_id = props.thingId || props.match.params.id
  if (thing_id == 'new')
    return {
      nThing: new NThing()
    }

  const nthing_sub = Meteor.subscribe('nthing_detail', thing_id);
  if (!nthing_sub.ready())
    return {
      loading: true
    }

  const nthing = Items.findOne({_id: thing_id});
  return {
    nThing: new NThing(nthing),
  };
})
(withStyles(styles)(NThingDetailDrawer)));
