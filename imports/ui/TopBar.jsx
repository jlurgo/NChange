import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// Item component - represents a single todo item
class TopBar extends Component {
  render() {

    return (
      <div className="component-container">
        <header>
          <h1>Items</h1>
          <AccountsUIWrapper />
        </header>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user(),
  };
})(TopBar);
