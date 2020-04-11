import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import { Items } from '../api/items.js';

// Item component - represents a single todo item
class ItemInList extends Component {
  render() {

    return (
      <div className="component-container">
        <span>
          {this.props.item.text}
        </span>
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})(ItemInList);
