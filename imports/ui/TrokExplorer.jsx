import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withSubscriptions } from './WithSubscriptions.js';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';
import { Troks } from '../api/troks.js';

// import ItemList from './TrokList';

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
class TrokExplorer extends Component {

  render() {
    console.warn(this.props.classes);
    return (
      <div className={this.props.classes.root}>
      </div>
    );
  }
}

export default withSubscriptions(['items'], (props) => {
  return {
    troks: Troks.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, withStyles(styles)(TrokExplorer));
