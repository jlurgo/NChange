import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';

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
    filter: {},
  }

  setFilter = (filter) => {
    this.setState({filter});
  }

  render() {
    const { classes } = this.props;
    console.warn('Item explorer state:', this.state);
    return (
      <div className={classes.root}>
        <ItemFilterBar filter={this.state.filter} onFilterChange={this.setFilter} />
        <ItemList filter={this.state.filter}
          classes={{root: classes.listRoot}}/>
      </div>
    );
  }
}

export default withStyles(styles)(ItemExplorer);
