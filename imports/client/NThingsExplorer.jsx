import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import { NThings } from "../shared/collections";

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import NThingList from './NThingList';
import NThingFilterBar from './NThingFilterBar';

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
class NThingsExplorer extends Component {
  state = {
    filter: {
      owner: {$ne: Meteor.userId()},
      stock: {$gt: 0}
    }
  }

  setFilter = (filter) => {
    this.setState({ filter });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NThingFilterBar filter={this.state.filter}
          onFilterChange={this.setFilter} />
        <NThingList filter={this.state.filter} showItemsArchiveButton
          showItemsNewNchangeButton
          classes={{root: classes.listRoot}}/>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(NThingsExplorer));
