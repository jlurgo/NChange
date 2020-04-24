import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';

const styles = {
  root: {
    flex: '0 0 100px',
    margin: '5px',
    cursor: 'pointer',
    position: 'relative',
    height: '100px',
    width: '100px'
  },
  pic: {
    maxWidth: '100%',
    height: 'auto'
  },
  icon: {
    color: 'white',
  },
};


// It's an item being exchanged in an nchange
class ItemInChange extends Component {
  render() {
    const { itemInChange, loading, classes } = this.props;
    return loading ?
      <div>Loading</div> :
      <Paper key={itemInChange.nThing._id} classes={{ root: classes.root }}>
        <img className={classes.pic} src={itemInChange.nThing.pics[0]}
          alt={itemInChange.nThing.shortDescription} />
      </Paper>
  }
}

export default withTracker((props) => {
  console.warn('iteminchange');
  const filter = {_id: props.itemInChange.nThing};
  const item_sub = Meteor.subscribe('filtered_items_summary', filter);

  const item = Items.findOne(filter);

  return {
    loading: !item_sub.ready(),
    itemInChange: _.extend({}, props.itemInChange, {nThing: item})
  };
})
(withStyles(styles)(withRouter(ItemInChange)));