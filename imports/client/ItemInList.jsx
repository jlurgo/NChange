import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TagBar from "./TagBar";
import NChangerAvatar from "./NChangerAvatar";

import { Items } from "../shared/collections";

const styles = {
  root: {
    position: 'relative',
    flex: '1 1 300px',
    height: '300px',
    margin: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    width: '100%'
  },
  pic: {
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  bottomBar: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    bottom: '0px',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  tagBarRoot: {
    flexWrap: 'wrap-reverse',
    flex: '1 1 auto'
  },
  likeIcon: {
    color: 'black',
    flex: '0 0 auto',
    cursor: 'pointer'
  },
  likeIconLiked: {
    color: 'red',
  },
  removeThingIcon: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    color: 'red'
  },
  ownerAvatar: {
    position: 'absolute',
    left: '5px',
    top: '5px'
  }
};


// Item component - represents a single todo item
class ItemInList extends Component {

  handleLikeButtonClick = (e) => {
    const { item } = this.props;
    this.itemliked() ?
      Meteor.call('nthings.unlike', item._id) :
      Meteor.call('nthings.like', item._id);
    e.stopPropagation()
  }

  itemliked = () => {
    const { item } = this.props;
    return item.likedBy &&
      !!_.findWhere(item.likedBy, {userId: Meteor.userId()});
  }

  handleRemoveClick = (e) => {
    Meteor.call('nthings.remove', this.props.item._id);
    e.stopPropagation();
  }

  handleClick = (e) => {
    const { onClick, item } = this.props;
    if(onClick) {
      onClick(item);
      return;
    }
    this.props.history.push(`/nthingdetail/${item._id}`)
  }

  render() {
    const { item, classes } = this.props;
    const is_my_own_thing = (item.owner == Meteor.userId());
    return (
      <Paper onClick={this.handleClick} key={item._id} classes={{ root: classes.root }}>
        <img src={item.pics[0]} alt={item.shortDescription}
          className={classes.pic}/>
        <div className={classes.bottomBar}>
          <TagBar tags={item.tags} classes={{root: classes.tagBarRoot}}/>
          { !is_my_own_thing &&
            <IconButton aria-label={`star ${item.shortDescription}`}
              className={classes.likeIcon} onClick={this.handleLikeButtonClick}>
              {this.itemliked() ?
                <FavoriteIcon className={classes.likeIconLiked} fontSize= 'large'/> :
                <FavoriteBorderIcon fontSize= 'large'/>
              }
            </IconButton>
          }
        </div>
        <NChangerAvatar nChangerId={item.owner}
          classes={{root: classes.ownerAvatar}}/>
        { is_my_own_thing &&
          <IconButton className={classes.removeThingIcon}
           onClick={this.handleRemoveClick}>
             <DeleteForeverIcon />
          </IconButton>
        }
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(ItemInList));
