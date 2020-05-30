import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';
import { runningOnMobile } from './utils'

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import TagBar from "./TagBar";
import NChangerAvatar from "./NChangerAvatar";
import NThingDetail from "./NThingDetail";
import SelectQtyButton from "./SelectQtyButton";

import { Items } from "../shared/collections";


const styles = {
  root: {
    position: 'relative',
    height: '142px',
    width: '142px',
    margin: '10px',
    '-webkit-tap-highlight-color': 'transparent',
  },
  pic: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1px dashed black'
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
    bottom: '-8px',
    right: '-8px',
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
    left: '-12px',
    top: '-12px'
  },
  guardianAvatar: {
    position: 'absolute',
    left: '-21px',
    top: '22px'
  },
  stockIndicator: {
    position: 'absolute',
    top: '7px',
    right: '2px',
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

  state = {
    isExpanded: false,
    showDetail: false
  }

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
          nThing: item._id, from: item.owner, qty: 1}],
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
    const { isExpanded, showDetail } = this.state;
    e.preventDefault();
    e.stopPropagation();
    if (showDetail) return;

    if(!isExpanded) {
      this.setState({
        isExpanded: true
      });
      return;
    }
    if(onClick) {
      onClick(item);
      return;
    }
    this.setState({
      isExpanded: false,
      showDetail: true
    });

    //this.props.history.push(`/nthingdetail/${item._id}`)
  }

  getStock = () => {
    const { item, nChange } = this.props;
    return nChange ?
      nChange.getRemainingThingStock(item) :
      item.stock;
  }

  handleMouseEnter = () => {
    if(runningOnMobile()) return;
    this.setState({
      isExpanded: true
    });
  }

  handleMouseLeave = () => {
    this.setState({
      isExpanded: false
    });
  }

  handleDetailClose = () => {
    this.setState({
      isExpanded: false,
      showDetail: false
    });
  }

  render() {
    const { item, showDeleteButton, showLikeButton, showNewNchangeButton,
      showQtyButton, showTags, nChange, nChangerId, classes } = this.props;
    const { isExpanded, showDetail } = this.state;
    const is_my_own_thing = (item.owner == Meteor.userId());
    return (
      <div onClick={this.handleClick} key={item._id} className={classes.root}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        <img src={item.thumbnail} alt={item.shortDescription}
          className={classes.pic}/>
        { isExpanded && showTags &&
            <div className={classes.bottomBar}>
            <TagBar tags={item.tags} classes={{root: classes.tagBarRoot}}/>
          </div>
        }
        { isExpanded &&
          <NChangerAvatar nChangerId={item.owner}
            classes={{root: classes.ownerAvatar}}/>
        }
        { isExpanded &&
          <div className={classes.stockIndicator}>
            {this.getStock()}
          </div>
        }
        { isExpanded && (item.owner !== item.guardian) &&
          <NChangerAvatar nChangerId={item.guardian}
            classes={{root: classes.guardianAvatar}} size='medium'/>
        }
        <div className={classes.buttonBar}>
          { isExpanded && showQtyButton &&
            <SelectQtyButton nThing={item} nChange={nChange}
              nChangerId={nChangerId}/>
          }
          { isExpanded && !is_my_own_thing && showLikeButton &&
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
          { isExpanded && !is_my_own_thing && showNewNchangeButton &&
            this.getStock() > 0 &&
            <IconButton className={classes.button + ' ' + classes.newNchangeButton}
              onClick={this.handleNchangeClick}>
               <SettingsEthernetIcon fontSize= 'small'/>
            </IconButton>
          }
          { isExpanded && is_my_own_thing &&
            (item.guardian == Meteor.userId()) && showDeleteButton &&
            <IconButton className={classes.button + ' ' + classes.removeThingIcon}
              onClick={this.handleRemoveClick}>
               <DeleteIcon fontSize= 'small'/>
            </IconButton>
          }
          <Dialog open={showDetail} onClose={this.handleDetailClose}
            aria-labelledby="form-dialog-title">
            <NThingDetail thingId={item._id} nChange={nChange}
              nChangerId={nChangerId}/>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(ItemInList));
