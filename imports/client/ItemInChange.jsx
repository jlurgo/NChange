import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import ResizeDetector  from 'react-resize-detector';
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import NChangerAvatar from './NChangerAvatar';

import { Items } from "../shared/collections";

const styles = {
  root: {
    flex: '0 1 100px',
    height: '100px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: '10px',
    marginRight: '10px'
  },
  pic: {
    maxWidth: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: '50%',
  },
  icon: {
    color: 'white',
  },
  nchangerAvatar: {
    position: 'absolute',
    top: '0px',
    right: '-15px',
    zIndex: '1'
  },
  nchangerAvatarImage: {
    height: '30px',
    width: '30px',
  },
  qtyIndicator: {
    position: 'absolute',
    top: '-2px',
    right: '-7px',
    height: '20px',
    width: '20px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    textAlign: 'center',
    paddingTop: '2px',
    boxSizing: 'border-box',
    fontSize: 'small',
    fontWeight: 'bold',
    zIndex: '2'
  }
};

// It's an item being exchanged in an nchange
class ItemInChange extends Component {
  state = {
    leftPanel: true,
    mainFrame: true,
    count: 0,
    width: undefined,
    height: undefined
  };

  constructor() {
    super();
    this.rootRef = React.createRef();
  };


  handleClick = (e) => {
    this.props.onClick && this.props.onClick(this.props.itemInChange.nThing._id);
    e.stopPropagation();
  };

  onResize = (width) => {
    this.setState({
      width
    })
  };

  render() {
    const { itemInChange, loading, classes } = this.props;
    const { width } = this.state;

    const nchanger_id = (itemInChange.user == Meteor.userId()) ?
      itemInChange.from : itemInChange.user;

    return (loading || !itemInChange.nThing) ?
      <div>Loading</div> :
      <div key={itemInChange.nThing._id} className={classes.root }
        style={{height: width}}
        onClick={this.handleClick} ref={this.rootRef}>
        <img className={classes.pic} src={itemInChange.nThing.pics[0]}
          alt={itemInChange.nThing.shortDescription} />
        <ResizeDetector handleWidth onResize={this.onResize}
          targetDomEl={this.rootRef.current} />
        <div className={classes.qtyIndicator}>
          {itemInChange.qty || 1}
        </div>
        <NChangerAvatar
          classes={{root:classes.nchangerAvatar,
            userImage:classes.nchangerAvatarImage}}
          nChangerId={nchanger_id}
          onClick={()=> {}}/>
      </div>
  }
}

export default withTracker((props) => {
  const filter = {_id: props.itemInChange.nThing};
  const item_sub = Meteor.subscribe('filtered_items_summary', filter);

  const item = Items.findOne(filter);

  return {
    loading: !item_sub.ready(),
    itemInChange: _.extend({}, props.itemInChange, {nThing: item})
  };
})
(withRouter(withStyles(styles)(ItemInChange)));
