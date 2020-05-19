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
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  }
};

// receives a list of nchanges and dislays them
class NChangesList extends Component {

  renderNChanges() {
    const { classes } = this.props;
    return this.props.nChanges.map((nchange) => {
      return (
        <NChangeInList key={nchange._id} nchange={nchange}
          nChangerId={Meteor.userId()}/>
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
  return { props };
})(withStyles(styles)(NChangesList));
