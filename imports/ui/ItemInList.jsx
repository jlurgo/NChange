import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';

const styles = {
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  tileRoot: {
    flex: '0 0 300px',
    maxHeight: '300px',
    minHeight: '300px',
    margin: '5px',
    //border: '1px dashed black',
    cursor: 'pointer'
  }
};


// Item component - represents a single todo item
class ItemInList extends Component {
  render() {
    const { item, classes } = this.props;
    return (
      <GridListTile onClick={()=>{
          this.props.history.push('/itemDetail')
        }} key={item._id} cols={1}
        rows={1}
        component={Paper}
        classes={{ root: classes.tileRoot }}>

        <img src={item.pics[0]} alt={item.shortDescription} />
        <GridListTileBar
          title={item.shortDescription}
          titlePosition="bottom"
          actionIcon={
            <IconButton aria-label={`star ${item.text}`} className={classes.icon}>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          }
          actionPosition="left"
          className={classes.titleBar}
        />
      </GridListTile>
    );
  }
}

export default withStyles(styles)(withRouter(ItemInList));
