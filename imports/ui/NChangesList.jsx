import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import NChangeInList from './NChangeInList';

const styles = {
  root: {
  }
};

// receives a list of nchanges and dislays them
class NChangesList extends Component {

  renderNChanges() {
    return this.props.nChanges.map((nchange) => {
      return (
        <NChangeInList
          key={nchange._id}
          nchange={nchange}
        />
      );
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        { this.renderNChanges() }
      </div>
    );
  }
}

export default withTracker((props) => {
  const { nChanges } = props;
  const all_n_changers = _.flatten(nChanges.map((nchng) => {
    return nchng.nChangers;
  }));
  const all_items = _.uniq(_.flatten(all_n_changers.map((nchngr) => {
    return _.pluck(nchngr.input_n_things, 'id');
  })));
  const items_sub = Meteor.subscribe('filtered_items_summary',
                                      { _id : { $in : all_items}});
  return {
    loading: !items_sub.ready()
  };
})(withStyles(styles)(NChangesList));
