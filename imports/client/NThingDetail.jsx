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

import TagBar from "./TagBar";
import SelectPicButton from "./SelectPicButton";
import TagSelectBar from './TagSelectBar';

import { Items } from "../shared/collections";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
  },
  picsSection: {
    position: 'relative',
    flex: '0 0 50vh',
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
    borderRight: '2px dashed black',
    borderBottom: '2px dashed black',
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
  }
};

//
class NThingDetail extends Component {

  updateThing = (n_thing) => {
    Meteor.call('nthings.update', n_thing);
  }

  removePic = (pic) => {
    const { nThing } = this.props;
    nThing.pics = _.without(nThing.pics, pic);
    this.updateThing(nThing);
  }

  addPic = (pic) => {
    const { nThing } = this.props;
    nThing.pics.push(pic);
    this.updateThing(nThing);
  }

  updateTags = (tags) => {
    const { nThing } = this.props;
    nThing.tags = tags;
    this.updateThing(nThing);
  }

  updateShortDescription = (e) => {
    const { nThing } = this.props;
    nThing.shortDescription = e.target.value;
    this.updateThing(nThing);
  }

  updateLongDescription = (e) => {
    const { nThing } = this.props;
    nThing.longDescription = e.target.value;
    this.updateThing(nThing);
  }

  renderPic = (pic, i) => {
    const { inEditMode, classes } = this.props;
    return  (
      <div className={classes.picContainer} key={i}>
        <img src={pic} alt={'picture'}
         className={classes.pic}/>
         { inEditMode &&
           <IconButton className={classes.removePicIcon}
            onClick={() => this.removePic(pic)}>
              <DeleteForeverIcon fontSize= 'large'/>
           </IconButton>
         }
      </div>
    );
  }

  render() {
    const { inEditMode, nThing, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <Paper classes={{ root: classes.root }}>
        <div className={classes.picsSection}>
          <div className={classes.picsList}>
            {
              nThing.pics.map(this.renderPic)
            }
            { inEditMode &&
              <SelectPicButton onSelect={this.addPic}
                classes={{ button: classes.addPicIcon }}/>
            }
          </div>
        </div>
        {inEditMode ?
          <TagSelectBar selectedTags={nThing.tags}
            onTagsChange={this.updateTags}/> :
          <TagBar tags={nThing.tags}/>
        }
        {
          inEditMode ?
            <TextField defaultValue={nThing.shortDescription}
              onChange={this.updateShortDescription}
              margin="dense" label="Título" type="text" fullWidth/> :
            <Typography variant="h4">
              {nThing.shortDescription}
            </Typography>
        }
        {
          inEditMode ?
            <TextField defaultValue={nThing.longDescription}
              onChange={this.updateLongDescription} multiline
              margin="dense" label="Descripción" type="text" fullWidth/> :
            <Typography variant="h6">
              {nThing.longDescription}
            </Typography>
        }
      </Paper>
    );
  }
}

export default withRouter(withTracker((props) => {
  const item_sub = Meteor.subscribe('nthing_detail', props.match.params.id);
  if (!item_sub.ready())
    return {
      loading: true
    }

  const n_thing = Items.findOne({_id: props.match.params.id});
  return {
    nThing: n_thing,
    inEditMode: n_thing.owner == Meteor.userId(),
  };
})
(withStyles(styles)(NThingDetail)));
