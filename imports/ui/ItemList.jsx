import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';

import { Items } from '../api/items.js';

import ItemInList from './ItemInList';
import LoadingPane from './LoadingPane';

const styles = {
  root: {
    //backgroundColor: 'rgba(255,255,255,0.3)'
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
    const { classes, loading } = this.props;
    if(loading) return <LoadingPane/>

    return (
      <div className={classes.root}>
        <GridList cellHeight={200} spacing={1} className={classes.grid}>
        { this.renderItems() }
        </GridList>
      </div>
    );
  }
}

export default withTracker((props) => {
  if(props.items) {
    return {
      items: props.items
    };
  }
  const items_sub = Meteor.subscribe('filtered_items_summary', props.filter, 10);
  return {
    loading: !items_sub.ready(),
    items: Items.find(props.filter).fetch()
  };
})(withStyles(styles)(ItemList));
