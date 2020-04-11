import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

// App component - represents the whole app
class ItemFilterBar extends Component {

  render() {
    return (
      <div className="component-container">
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})(ItemFilterBar);
