import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'

import { NChanges } from "../shared/collections";

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import NChangesList from './NChangesList';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '5px',
  },
  listRoot: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100px',
    overflowY: 'auto',
  },
  addButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  }
};

// App component - represents the whole app
class NChangesExplorer extends Component {

  addNChange = () => {
    const { history } = this.props;
    Meteor.call('nchanges.new', (error, nchange_id)=> {
      if (error) {
        console.warn(error);
        return;
      }
      history.push(`/nchangedetail/${nchange_id}`);
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={this.props.classes.root}>
        <NChangesList nChanges={this.props.nChanges}
          classes={{root: this.props.classes.listRoot}}/>
        <Fab onClick={this.addNChange} className={classes.addButton}
          color="primary" aria-label="add">
          <AddIcon />
        </Fab>
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
})(withStyles(styles)(withRouter(NChangesExplorer)));
