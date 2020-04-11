import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withSubscriptions } from './WithSubscriptions';
import TopBar from './TopBar';
import ItemFinder from './ItemFinder';

// App component - represents the whole app
class App extends Component {

  render() {
    return (
      <div className="container">
        <TopBar/>
        <ItemFinder/>
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})(App);
