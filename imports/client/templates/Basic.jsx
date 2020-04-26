import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { ACollection } from "../../shared/collections";

const styles = {
  root: {

  },
};

//
class MyComponent extends Component {
  render() {
    const { loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <div className={classes.root }>

      </div>
    );
  }
}

export default withTracker((props) => {
  const sub = Meteor.subscribe('a_publication');
  return {
    loading: !item_sub.ready(),

  };
})
(withRouter(withStyles(styles)(MyComponent)));
