import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import ExtensionIcon from '@material-ui/icons/Extension';
import { withStyles } from '@material-ui/core/styles';

import { NThings } from "../shared/collections";

const styles = {
  root: {
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  pic: {
    maxWidth: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
};


// It's an item being exchanged in an nchange
class NThingIcon extends Component {
  render() {
    const { nThing, loading, classes } = this.props;
    return (
      <div key={nThing && nThing._id} className={classes.root }>
        { (loading || !nThing) ?
          <ExtensionIcon /> :
          <img className={classes.pic} src={nThing.thumbnail} alt= ''/>
        }
      </div>
    );
  }
}

export default withTracker((props) => {
  const filter = {_id: props.nThingId};
  const item_sub = Meteor.subscribe('filtered_items_summary', filter);

  const n_thing = NThings.findOne(filter);

  return {
    loading: !item_sub.ready(),
    nThing: n_thing
  };
})
(withRouter(withStyles(styles)(NThingIcon)));
