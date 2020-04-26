import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';
import Paper from '@material-ui/core/Paper';

import { Items } from "../shared/collections";

const styles = {
  root: {

  },
};

//
class NThingDetail extends Component {
  render() {
    const { nThing, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <Paper classes={{ root: classes.root}}>
        {JSON.stringify(nThing)}
      </Paper>
    );
  }
}

export default withRouter(withTracker((props) => {
  const item_sub = Meteor.subscribe('nthing_detail', props.match.params.id);
  return {
    loading: !item_sub.ready(),
    nThing: Items.findOne({_id: props.match.params.id})
  };
})
(withStyles(styles)(NThingDetail)));
