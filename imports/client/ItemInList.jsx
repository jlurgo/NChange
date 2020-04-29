import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Items } from "../shared/collections";

const styles = {
  root: {
    flex: '1 1 300px',
    height: '300px',
    margin: '5px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
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
    flex: '0 0 50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch'
  },
  title: {
    flex: '1 1 auto',
    marginLeft: '15px'
  },
  likeIcon: {
    color: 'red',
    flex: '0 0 auto'
  },
  likeIconLiked: {

  }
};


// Item component - represents a single todo item
class ItemInList extends Component {
  render() {
    const { item, classes } = this.props;
    return (
      <Paper onClick={()=>{
          this.props.history.push(`/nthingdetail/${item._id}`)
        }} key={item._id}
        classes={{ root: classes.root }}>
        <div className={classes.picContainer}>
          <img src={item.pics[0]} alt={item.shortDescription}
            className={classes.pic}/>
        </div>
        <div className={classes.titleBar}>
          <Typography className={classes.title} noWrap variant="h6">
            {item.shortDescription}
          </Typography>
          {(item.owner != Meteor.userId()) &&
            <IconButton aria-label={`star ${item.shortDescription}`}
              className={classes.likeIcon}>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          }
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(ItemInList));
