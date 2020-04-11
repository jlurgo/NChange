import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Items } from '../api/items.js';

import ItemInList from './ItemInList';

// App component - represents the whole app
export default class ItemList extends Component {
  constructor(props) {
    super(props);
  }

  renderItems() {
    return this.props.items.map((item) => {
      return (
        <ItemInList
          key={item._id}
          item={item}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderItems()}
        </ul>
      </div>
    );
  }
}
