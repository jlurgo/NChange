import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import { NChanges } from '../api/nChanges.js';

import NChangesList from './NChangesList';

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
class NChangesExplorer extends Component {

  render() {
    return (
      <div className={this.props.classes.root}>
        <NChangesList nChanges={this.props.nChanges}
          classes={{root: this.props.classes.listRoot}}/>
      </div>
    );
  }
}

export default withTracker((props) => {
  const nchanges_sub = Meteor.subscribe('user_n_changes');
  return {
    loading: !nchanges_sub.ready(),
    nChanges: NChanges.find().fetch(),
  };
})(withStyles(styles)(NChangesExplorer));
