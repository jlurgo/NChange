import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withSubscriptions } from './WithSubscriptions.js';

import { Items } from '../api/items.js';

import ItemList from './ItemList';
import ItemFilterBar from './ItemFilterBar';

// App component - represents the whole app
class ItemFinder extends Component {
  state = {
    filter: '',
  }

  setFilter = (new_filter) => {
    this.setState({filter: new_filter});
  }

  render() {
    return (
      <div className="component-container">
        <ItemFilterBar onFilterChange={this.setFilter} />
        <ItemList items={this.props.filteredItems}/>
      </div>
    );
  }
}

export default withSubscriptions(['items'], (props) => {
  return {
    filteredItems: Items.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, ItemFinder);
