import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';


const styles = {
  root: {
  },
};


// Item component - represents a single todo item
class NChangeInList extends Component {
  render() {
    const { nchange, classes } = this.props;
    return (
      <Paper>
        {JSON.stringify(nchange)}
      </Paper>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe('filtered_items_summary', props.nchange._id);
  return {
    // nChanges: NChanges.find({}, { sort: { createdAt: -1 } }).fetch(),
    // items: Items.find({}).fetch()
  };
})(withStyles(styles)(NChangeInList));
