import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'

import { Items } from "../shared/collections";

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import ItemList from './ItemList';
import ItemFilterBar from './ItemFilterBar';

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
class ItemExplorer extends Component {
  state = {
    filter: {},
  }

  setFilter = (filter) => {
    this.setState({filter});
  }

  addThing = () => {
    const { history } = this.props;
    Meteor.call('nthings.new', (error, thing_id)=> {
      if (error) {
        console.warn(error);
        return;
      }
      history.push(`/nthingdetail/${thing_id}`);
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ItemFilterBar filter={this.state.filter} onFilterChange={this.setFilter} />
        <ItemList filter={this.state.filter}
          classes={{root: classes.listRoot}}/>
        <Fab onClick={this.addThing} className={classes.addButton} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ItemExplorer));
