import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
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
  buttonBar: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px'
  },
  button: {
    marginBottom: '5px'
  },
  plusIcon: {
    backgroundColor: '#41b53f'
  },
  minusIcon: {
    backgroundColor: '#41b53f'
  },
  tagBarRoot: {
    flexWrap: 'wrap-reverse',
    flex: '1 1 auto'
  },
  likeIcon: {
    color: 'black',
    flex: '0 0 auto',
    cursor: 'pointer',
    backgroundColor: 'pink'
  },
  likeIconLiked: {
    color: 'red',
  },
  removeThingIcon: {
    backgroundColor: '#ff8a12',
  },
  ownerAvatar: {
    position: 'absolute',
    left: '2px',
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
    e.stopPropagation();
  }

  itemliked = () => {
    const { item } = this.props;
    return item.likedBy &&
      !!_.findWhere(item.likedBy, {userId: Meteor.userId()});
  }

  handleRemoveClick = (e) => {
    Meteor.call('nthings.archive', this.props.item._id);
    e.stopPropagation();
  }

  handlePlusClick = (e) => {
    const { onPlusButtonClick, item } = this.props;
    onPlusButtonClick(item);
    e.stopPropagation();
  }

  handleMinusClick = (e) => {
    const { onMinusButtonClick, item } = this.props;
    onMinusButtonClick(item);
    e.stopPropagation();
  }

  handleNchangeClick = (e) => {
    const { item, history } = this.props;
    e.stopPropagation();
    Meteor.call('nchanges.new', item.owner,
      [{user: Meteor.userId(), action: 'take',
        nThing: item._id, from: item.owner}],
      (error, nchange_id) => {
        if (error) {
          console.warn(error);
          return;
        }
        history.push(`/nchangedetail/${nchange_id}`);
      });

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
    const { item, showDeleteButton, showLikeButton, onPlusButtonClick,
      showNewNchangeButton, onMinusButtonClick,
      classes } = this.props;
    const is_my_own_thing = (item.owner == Meteor.userId());
    return (
      <Paper onClick={this.handleClick} key={item._id} classes={{ root: classes.root }}>
        <img src={item.pics[0]} alt={item.shortDescription}
          className={classes.pic}/>
        <div className={classes.bottomBar}>
          <TagBar tags={item.tags} classes={{root: classes.tagBarRoot}}/>
        </div>
        <NChangerAvatar nChangerId={item.owner}
          classes={{root: classes.ownerAvatar}}/>
        <div className={classes.buttonBar}>
          { onPlusButtonClick &&
            <IconButton className={classes.button + ' ' + classes.plusIcon}
              onClick={this.handlePlusClick}>
               <AddIcon fontSize= 'small'/>
            </IconButton>
          }
          { onMinusButtonClick &&
            <IconButton className={classes.button + ' ' + classes.minusIcon}
              onClick={this.handleMinusClick}>
               <RemoveIcon fontSize= 'small'/>
            </IconButton>
          }
          { !is_my_own_thing && showLikeButton &&
            <IconButton aria-label={`star ${item.shortDescription}`}
              className={classes.button + ' ' + classes.likeIcon}
              onClick={this.handleLikeButtonClick}>
              {this.itemliked() ?
                <FavoriteIcon className={classes.likeIconLiked} fontSize= 'small'/> :
                <FavoriteBorderIcon fontSize= 'small'/>
              }
            </IconButton>
          }
          { !is_my_own_thing && showNewNchangeButton &&
            <IconButton className={classes.button + ' ' + classes.minusIcon}
              onClick={this.handleNchangeClick}>
               <SettingsEthernetIcon fontSize= 'small'/>
            </IconButton>
          }
          { is_my_own_thing && showDeleteButton &&
            <IconButton className={classes.button + ' ' + classes.removeThingIcon}
              onClick={this.handleRemoveClick}>
               <DeleteIcon fontSize= 'small'/>
            </IconButton>
          }
        </div>
      </Paper>
    );
  }
}

export default withRouter(withStyles(styles)(ItemInList));
