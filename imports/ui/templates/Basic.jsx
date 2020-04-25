import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

const styles = {
  root: {

  },
};

//
class MyComponent extends Component {
  render() {
    const { loading, classes, history } = this.props;
    return loading ?
      <div>Loading...</div> :
      <div className={classes.root }>

      </div>
  }
}

export default withTracker((props) => {
  const sub = Meteor.subscribe('a_publication');
  return {
    loading: !item_sub.ready(),
  };
})
(withRouter(withStyles(styles)(ItemInChange)));
