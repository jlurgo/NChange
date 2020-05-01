import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    display: 'flex',
    flex: '0 0 40px',
    padding: '10px'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px',
    paddingLeft: '15px',
    paddingRight: '15px',
    borderRadius: '25px',
    backgroundColor: '#afe9af',
  }
};

//
class TagBar extends Component {

  renderTag = (tag) => {
    const { classes } = this.props;
    return (
      <div className={classes.tag} key={tag}>
        <Typography variant="h6">
          {tag}
        </Typography>
      </div>
    );
  }
  render() {
    const { tags, loading, classes, history } = this.props;

    return (
      <div className={classes.root}>
        {
          tags.map(this.renderTag)
        }
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})
(withRouter(withStyles(styles)(TagBar)));
