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
import ItemList from './ItemList';

import { Items } from '../api/items.js';

const styles = {
  root: {
  },
};


// Item component - represents a single todo item
class NChangeInList extends Component {
  render() {
    const { nchange, user_input_items, classes } = this.props;
    return (
      <Paper>
        <ItemList items={user_input_items}/>
      </Paper>
    );
  }
}

export default withTracker((props) => {
  const { nchange } = props;
  const user_input_item_ids = _.pluck(
    _.findWhere(
      (nchange.nChangers),
      {id: Meteor.userId()}
    ).input_n_things, 'id');

  const user_input_items = Items.find({ _id: {
    $in: user_input_item_ids}}).fetch();
  return {
    user_input_items: user_input_items
  };
})(withStyles(styles)(NChangeInList));
