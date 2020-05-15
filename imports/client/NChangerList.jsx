import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import Typography from '@material-ui/core/Typography';

import NChangerAvatar from './NChangerAvatar';
import LoadingPane from './LoadingPane';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  nChanger: {
    display: 'flex',
    alignItems: 'center'
  }
};

// ItemList component - receives a list of items and dislays them
class NChangerList extends Component {

  render() {
    const { nchangers, onSelect, classes, loading } = this.props;

    if(loading) return <LoadingPane/>
    return (
      <div className={classes.root}>
        {nchangers.map((nchanger) => {
          return (
            <div className={classes.nChanger}>
              <NChangerAvatar nChanger={nchanger} key={nchanger._id}
                onClick={onSelect}/>
              <Typography variant="h6">
                {`${nchanger.userName}` }
              </Typography>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withTracker((props) => {
  const nchangers_sub = Meteor.subscribe('nchangers_list', props.filter);
  const nchangers = Meteor.users.find(props.filter).fetch();
  return {
    loading: !nchangers_sub.ready(),
    nchangers: nchangers
  };
})(withStyles(styles)(NChangerList));
