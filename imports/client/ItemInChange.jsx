import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import { Items } from "../shared/collections";

const styles = {
  root: {
    flex: '0 0 100px',
    height: '100px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '50%',
    marginLeft: '10px',
    marginRight: '10px'
  },
  pic: {
    maxWidth: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover'
  },
  icon: {
    color: 'white',
  },
};


// It's an item being exchanged in an nchange
class ItemInChange extends Component {

  handleClick = (e) => {
    this.props.onClick && this.props.onClick(this.props.itemInChange.nThing._id);
    e.stopPropagation();
  }

  render() {
    const { itemInChange, loading, classes } = this.props;
    return (loading || !itemInChange.nThing) ?
      <div>Loading</div> :
      <div key={itemInChange.nThing._id} className={classes.root }
        onClick={this.handleClick}>
        <img className={classes.pic} src={itemInChange.nThing.pics[0]}
          alt={itemInChange.nThing.shortDescription} />
      </div>
  }
}

export default withTracker((props) => {
  const filter = {_id: props.itemInChange.nThing};
  const item_sub = Meteor.subscribe('filtered_items_summary', filter);

  const item = Items.findOne(filter);

  return {
    loading: !item_sub.ready(),
    itemInChange: _.extend({}, props.itemInChange, {nThing: item})
  };
})
(withRouter(withStyles(styles)(ItemInChange)));
