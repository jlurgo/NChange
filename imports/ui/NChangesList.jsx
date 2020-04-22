import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';

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

export default withStyles(styles)(NChangesList);
