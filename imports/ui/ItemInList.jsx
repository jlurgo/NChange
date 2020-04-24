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

import { Items } from '../api/items.js';

const styles = {
  root: {
    flex: '0 0 auto',
    height: '250px',
    width: '250px',
    margin: '5px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  titleBar: {
    background:
    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    color: 'white',
    flex: '0 0 15px',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: 'white',
  },
  picContainer: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'hidden'
  },
  pic: {
    maxWidth: '100%',
    height: 'auto'
  },
};


// Item component - represents a single todo item
class ItemInList extends Component {
  render() {
    const { item, classes } = this.props;
    return (
      <Paper onClick={()=>{
          this.props.history.push('/itemDetail')
        }} key={item._id}
        classes={{ root: classes.root }}>
        <div className={classes.picContainer}>
          <img src={item.pics[0]} alt={item.shortDescription}
            className={classes.pic}/>
        </div>
        <div className={classes.titleBar}>
          <IconButton aria-label={`star ${item.shortDescription}`}
            className={classes.icon}>
            <FavoriteBorderOutlinedIcon />
          </IconButton>
          <Typography noWrap variant="h6" className={classes.separator}>
            {item.shortDescription}
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(ItemInList));
