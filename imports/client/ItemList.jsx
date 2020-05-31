import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import { Items } from "../shared/collections";
import NThing from "../shared/NThing";

import NThingInList from './NThingInList';
import LoadingPane from './LoadingPane';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    position: 'relative',
    height: '100%'
  },
};

// ItemList component - receives a list of items and dislays them
class ItemList extends Component {

  render() {
    const { classes, loading } = this.props;

    if(loading) return <LoadingPane/>
    return (
      <div className={classes.root} id='drawer-container'>
        { this.renderThings() }
      </div>
    );
  }

  renderThings = () => {
    return this.props.items.map(this.props.renderThing || this.renderThing);
  }

  renderThing = (nthing) => {
    return (
      <NThingInList key={nthing._id} nThing={nthing}
        onClick={this.props.onItemClick}
        showNewNchangeButton={this.props.showItemsNewNchangeButton}/>
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
  const items = Items.find(props.filter).map((item)=>{
    return new NThing(item);
  });
  return {
    loading: !items_sub.ready(),
    items: items
  };
})(withStyles(styles)(ItemList));
