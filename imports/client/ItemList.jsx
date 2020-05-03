import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import { Items } from "../shared/collections";

import ItemInList from './ItemInList';
import LoadingPane from './LoadingPane';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'start'
  },
};

// ItemList component - receives a list of items and dislays them
class ItemList extends Component {

  renderItems() {
    return this.props.items.map((item) => {
      return (
        <ItemInList key={item._id} item={item} onClick={this.props.onItemClick}
        />
      );
    });
  }

  render() {
    const { classes, loading } = this.props;

    if(loading) return <LoadingPane/>
    return (
      <div className={classes.root}>
        { this.renderItems() }
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
  const items_sub = Meteor.subscribe('filtered_items_summary', props.filter, 50);
  let items = Items.find(props.filter).fetch();
  if(props.filter.tags) {
    items = items.map((item)=>{
      item.tags = _.difference(item.tags, props.filter.tags.$all);
      return item;
    });
  }
  return {
    loading: !items_sub.ready(),
    items: items
  };
})(withStyles(styles)(ItemList));
