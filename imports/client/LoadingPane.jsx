import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Item component - represents a single todo item
export default class LoadingPane extends Component {
  render() {
    return (
      <div className="component-container loading-pane">
        Loading...
      </div>
    );
  }
}
