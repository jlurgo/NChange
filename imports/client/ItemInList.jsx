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
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { withStyles } from '@material-ui/core/styles';

import TagBar from "./TagBar";
import NChangerAvatar from "./NChangerAvatar";
import SelectQtyButton from "./SelectQtyButton";

import { Items } from "../shared/collections";


const styles = {
  root: {
    position: 'relative',
    flex: '1 1 300px',
    height: '300px',
    margin: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    maxHeight: '44vw',
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
    bottom: '5px',
    right: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px'
  },
  button: {
    marginBottom: '5px'
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
  newNchangeButton: {
    backgroundColor: 'green'
  },
  removeThingIcon: {
    backgroundColor: '#ff8a12 !important',
  },
  ownerAvatar: {
    position: 'absolute',
    left: '2px',
    top: '5px'
  },
  stockIndicator: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    height: '30px',
    width: '30px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    textAlign: 'center',
    paddingTop: '7px',
    boxSizing: 'border-box',
    fontSize: 'small',
    fontWeight: 'bold',
    zIndex: '2'
  }
};


// Item component - represents a single item
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

  handleNchangeClick = (e) => {
    const { item, history } = this.props;
    e.stopPropagation();
    this.getStock() > 0 &&
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

  getStock = () => {
    const { item, nChange } = this.props;
    return nChange ?
      nChange.getRemainingThingStock(item) :
      (item.stock === undefined) ? 1 : item.stock;
  }

  render() {
    const { item, showDeleteButton, showLikeButton, showNewNchangeButton,
      showQtyButton, nChange, nChangerId, classes } = this.props;
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
        <div className={classes.stockIndicator}>
          {this.getStock()}
        </div>
        <div className={classes.buttonBar}>
          { showQtyButton &&
            <SelectQtyButton nThing={item} nChange={nChange}
              nChangerId={nChangerId}/>
          }
          { !is_my_own_thing && showLikeButton &&
            <IconButton aria-label={`star ${item.shortDescription}`}
              className={classes.button + ' ' + classes.likeIcon}
              onClick={this.handleLikeButtonClick}>
              {this.itemliked() ?
                <FavoriteIcon className={classes.likeIconLiked}
                  fontSize= 'small'/> :
                <FavoriteBorderIcon fontSize= 'small'/>
              }
            </IconButton>
          }
          { !is_my_own_thing && showNewNchangeButton && this.getStock() > 0 &&
            <IconButton className={classes.button + ' ' + classes.newNchangeButton}
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
