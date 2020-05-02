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

import { Items } from "../shared/collections";

const styles = {
  root: {
    position: 'relative',
    display: 'flex',
    flex: '1 1 300px',
    height: '300px',
    margin: '5px',
    cursor: 'pointer',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden'
  },
  picContainer: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    borderBottom: '1.5px black dashed',
  },
  pic: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  titleBar: {
    backgroundColor: '#41b53f',
    color: 'white',
    flex: '0 0 59px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch'
  },
  title: {
    flex: '1 1 auto',
    marginLeft: '15px'
  },
  likeIcon: {
    color: 'white',
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
    e.stopPropagation()
  }

  render() {
    const { item, classes } = this.props;
    const is_my_own_thing = (item.owner == Meteor.userId());
    return (
      <Paper onClick={()=>{
          this.props.history.push(`/nthingdetail/${item._id}`)
        }} key={item._id} classes={{ root: classes.root }}>
        <div className={classes.picContainer}>
          <img src={item.pics[0]} alt={item.shortDescription}
            className={classes.pic}/>
        </div>
        <div className={classes.titleBar}>
          <Typography className={classes.title} noWrap variant="h6">
            {item.shortDescription}
          </Typography>
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
