import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { NChanges } from "../shared/collections";

import NChangeInList from './NChangeInList';

const styles = {
  root: {

  },
};

//
class NChangeDetail extends Component {
  render() {
    const { nchange, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <div className={classes.root }>
        <NChangeInList
          key={nchange._id}
          nchange={nchange}
        />
      </div>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.match.params.id;
  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  return {
    loading: !nchange_sub.ready(),
    nchange: NChanges.findOne({_id: nchange_id})
  };
})
(withStyles(styles)(NChangeDetail)));
