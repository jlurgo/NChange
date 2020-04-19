import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';
import { withSubscriptions } from './WithSubscriptions.js';

import { Items } from '../api/items.js';

import ItemInList from './ItemInList';

const styles = {
  root: {
  },
  grid: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
};

// ItemList component - receives a list of items and dislays them
class ItemList extends Component {

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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <GridList cellHeight={200} spacing={1} className={classes.grid}>
        { this.renderItems() }
        </GridList>
      </div>
    );
  }
}

export default withSubscriptions(['items'], (props) => {
  if(props.items) {
    return {
      items: props.items
    };
  }
  return {
    items: Items.find(props.filter).fetch()
  };
}, withStyles(styles)(ItemList));
