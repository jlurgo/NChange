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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import TagBar from "./TagBar";
import SelectPicButton from "./SelectPicButton";
import TagSelectBar from './TagSelectBar';
import NChangerAvatar from "./NChangerAvatar";

import { Items } from "../shared/collections";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
  },
  picsSection: {
    position: 'relative',
    flex: '0 0 30vh',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    overflowX: 'auto',
  },
  picsList: {
    height: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    overflowX: 'auto',
  },
  picContainer: {
    position: 'relative',
  },
  pic: {
    height: '100%',
    objectFit: 'contain'
  },
  removePicIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
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
    this.props.history.goBack();
  }

  handleSave = () => {
    const { nThing } = this.state;
    console.warn('saving:', nThing);
    if (!nThing._id) {
      Meteor.call('nthings.new', nThing, (error, thing_id)=> {
        if (error) {
          console.warn(error);
          return
        }
        this.handleClose();
      });
      return
    }
    Meteor.call('nthings.update', nThing, (error)=> {
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

  handleStockCheckChange = (e) => {
    const { nThing } = this.state;
    nThing.stock = e.target.checked ? 1 : undefined;
    this.setState(nThing);
  }

  renderPic = (pic, i) => {
    const { inCreateMode, inEditMode, classes } = this.props;
    return  (
      <div className={classes.picContainer} key={i}>
        <img src={pic} alt={'picture'}
         className={classes.pic}/>
         { (inCreateMode || inEditMode) &&
           <IconButton className={classes.removePicIcon}
            onClick={() => this.removePic(pic)}>
              <DeleteForeverIcon fontSize= 'large'/>
           </IconButton>
         }
      </div>
    );
  }

  render() {
    const { inCreateMode, inEditMode, loading, classes, history } = this.props;
    if (loading) return <div>Loading...</div>

    const nThing = (inCreateMode || inEditMode) ? this.state.nThing : this.props.nThing;

    return (
      <Paper classes={{ root: classes.root }}>
        <div className={classes.picsSection}>
          <div className={classes.picsList}>
            {
              nThing.pics && nThing.pics.map(this.renderPic)
            }
            { (inCreateMode || inEditMode) &&
              <SelectPicButton onSelect={this.addPic}
                classes={{ button: classes.addPicIcon }}/>
            }
          </div>
        </div>
        {
          (inCreateMode || inEditMode) ?
            <TagSelectBar selectedTags={nThing.tags}
              onTagsChange={this.updateTags}/> :
            <TagBar tags={nThing.tags}/>
        }
        { !inCreateMode &&
          <div className={classes.propertySection}>
            <Typography variant="h5" >
              Dueño:
            </Typography>
            <NChangerAvatar nChangerId={nThing.owner}/>
            {(nThing.owner !== nThing.guardian) &&
              <Typography variant="h5" >
                Lo tiene:
              </Typography>
            }
            {(nThing.owner !== nThing.guardian) &&
              <NChangerAvatar nChangerId={nThing.guardian}/>
            }
          </div>
        }
        <div className={classes.stockSection}>
          {
            (inCreateMode || inEditMode) ?
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
          (inCreateMode || inEditMode) ?
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
            (nThing.owner == Meteor.userId()) &&
            (nThing.owner !== nThing.guardian) &&
              <Button onClick={this.handleReceived} color="secondary">
                marcar como recibido
              </Button>
          }
          {
            (inCreateMode || inEditMode) &&
              <Button onClick={this.handleClose} color="secondary">
                Cancelar
              </Button>
          }
          {
            (inCreateMode || inEditMode) &&
              <Button onClick={this.handleSave} color="primary">
                Guardar
              </Button>
          }
        </div>
      </Paper>
    );
  }
}

export default withRouter(withTracker((props) => {
  const thing_id = props.match.params.id
  if (thing_id == 'new') {
    return {
      nThing: {},
      inCreateMode: true,
    }
  }

  const item_sub = Meteor.subscribe('nthing_detail', thing_id);
  if (!item_sub.ready())
    return {
      loading: true
    }

  const nthing = Items.findOne({_id: thing_id});
  return {
    nThing: nthing,
    inEditMode: (nthing.owner == Meteor.userId()) &&
                (nthing.guardian == Meteor.userId()),
  };
})
(withStyles(styles)(NThingDetail)));
