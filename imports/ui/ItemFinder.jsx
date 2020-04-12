import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withSubscriptions } from './WithSubscriptions.js';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';

import ItemList from './ItemList';
import ItemFilterBar from './ItemFilterBar';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  listRoot: {
    flexGrow: 1,
    flexShrink: 1,
  }
};

// App component - represents the whole app
class ItemFinder extends Component {
  state = {
    filter: '',
  }

  setFilter = (new_filter) => {
    this.setState({filter: new_filter});
  }

  render() {
    console.warn(this.props.classes);
    return (
      <div className={this.props.classes.root}>
        <ItemFilterBar onFilterChange={this.setFilter} />
        <ItemList items={this.props.filteredItems}
          classes={{root: this.props.classes.listRoot}}/>
      </div>
    );
  }
}

export default withSubscriptions(['items'], (props) => {
  return {
    filteredItems: Items.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, withStyles(styles)(ItemFinder));
