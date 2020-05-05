import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import { Items } from "../shared/collections";

const styles = {
  root: {
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
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
    return loading ?
      <div>Loading</div> :
      <div key={nThing._id} className={classes.root }>
        <img className={classes.pic} src={nThing.pics[0]} alt= ''/>
      </div>
  }
}

export default withTracker((props) => {
  const filter = {_id: props.nThingId};
  const item_sub = Meteor.subscribe('filtered_items_summary', filter);

  const n_thing = Items.findOne(filter);

  return {
    loading: !item_sub.ready(),
    nThing: n_thing
  };
})
(withRouter(withStyles(styles)(NThingIcon)));
