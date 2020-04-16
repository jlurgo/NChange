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
    flexDirection: 'column',
    backgroundColor: 'white',
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
    filter: '',
  }

  setFilter = (new_filter) => {
    this.setState({filter: new_filter});
  }

  render() {
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
  const filtered_items = Items.find({}).fetch();
  return {
    filteredItems: filtered_items,
  };
}, withStyles(styles)(ItemExplorer));
