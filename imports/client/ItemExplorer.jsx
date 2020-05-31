import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'

import { Items } from "../shared/collections";

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import ItemList from './ItemList';
import ItemFilterBar from './ItemFilterBar';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '5px',
  },
  listRoot: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100px',
    overflowY: 'auto',
  }
};

// App component - represents the whole app
class ItemExplorer extends Component {
  state = {
    filter: {owner: {$ne: Meteor.userId()}, $or: [
      {stock: {$gt: 0}},
      {stock: {$exists: false}}
    ]},
  }

  setFilter = (filter) => {
    filter.owner = {$ne: Meteor.userId()};
    $or: [
      {stock: {$gt: 0}},
      {stock: {$exists: false}}
    ]
    this.setState({filter});
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ItemFilterBar filter={this.state.filter}
          onFilterChange={this.setFilter} />
        <ItemList filter={this.state.filter} showItemsArchiveButton
          showItemsNewNchangeButton
          classes={{root: classes.listRoot}}/>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ItemExplorer));
