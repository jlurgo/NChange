import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import SendIcon from '@material-ui/icons/Send';

import { withStyles } from '@material-ui/core/styles';
import NChangerAvatar from './NChangerAvatar';
import NThingInList from './NThingInList';

const styles = {
  root: {
    display: 'flex',
    flex: '1 1 auto',
    height: '120px',
    alignItems: 'center',
    margin: '5px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'unset',
    '-webkit-tap-highlight-color': 'transparent',
    boxSizing: 'border-box'
  },
  itemList: {
    flex: '1 1 100px',
    height: '100%',
    minWidth: '100px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    paddingRight: '40px'
  },
  listOnTheRight: {
    justifyContent: 'flex-start',
    paddingRight: 'unset',
    paddingLeft: '40px'
  },
  animatedBackground: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    backgroundImage: `url(${Meteor.absoluteUrl()}bg-clouds.png)`,
    backgroundPosition: '0px 0px',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    animation: 'animatedBackground 600s linear infinite',
    zIndex: '-1'
  },
  animatedBackgroundRight: {
    transform: 'scaleX(-1)'
  },
  okButton: {
    flex: '0 0 auto',
    backgroundColor: '#ffee1f61',
    marginLeft: '-30px',
    marginRight: '-30px',
    zIndex: '1'
  },
  otherUserAvatar: {
    flex: '0 0 auto',
    marginLeft: '-42px',
    marginRight: '-42px',
    zIndex: '1'
  },
  otherUserAvatarImage: {
    height: '60px',
    width: '60px',
  },
  approvedOkButton: {
    color: '#41b53f',
  },
  finishedOkButton: {
    color: 'orange'
  },
  selected: {
    boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.75)'
  }
};


// Item component - represents a single todo item
class NChangeInList extends Component {

  approveNchange = (e) => {
    Meteor.call('nchanges.approve', this.props.nChange._id);
    e.stopPropagation();
  }

  dontApproveNchange = (e) => {
    Meteor.call('nchanges.dont_approve', this.nChange.nchange._id);
    e.stopPropagation();
  }

  sendNchange = (e) => {
    Meteor.call('nchanges.send', this.props.nChange._id);
    e.stopPropagation();
  }

  onInputItemClick = (item_id) => {
    const { nChange, nChangerId } = this.props;
    const take_action = _.where(nChange.detail,
      { action: 'take', nThing: item_id, user: nChangerId});
    Meteor.call('nchanges.releaseItem', nChange._id, nChangerId, item_id,
      take_action.from);
  }

  onOutputItemClick = (item_id) => {
    const { nChange, nChangerId } = this.props;
    const take_action = _.findWhere(nChange.detail,
      { action: 'take', nThing: item_id, from: nChangerId});
    Meteor.call('nchanges.retrieveItem', nChange._id, nChangerId, item_id,
      take_action.user);
  }

  renderThings(taken_things, onClick) {
    const { nChange, nChangerId, enableItemRemoving, classes } = this.props;
    return taken_things.map((taken_thing) => {
      return (
        <NThingInList key={taken_thing.nThing} nThingId={taken_thing.nThing}
          nChange={nChange} nChangerId={nChangerId} size={'100px'}/>
      );
    });
  }

  renderMiddleButton = () => {
    const { nChange, nChangerId, classes } = this.props;
    if (nChangerId !== Meteor.userId())
      return (
        <NChangerAvatar
          classes={{root:classes.otherUserAvatar,
            userImage:classes.otherUserAvatarImage}}
          nChangerId={nChangerId}/>
      )

    if (nChange.draft)
      return (
        <IconButton className={classes.okButton} onClick={this.sendNchange}>
            <SendIcon fontSize='large'/>
        </IconButton>
      )

    if (nChange.approved)
      return (
        <IconButton className={classes.okButton + ' ' + classes.finishedOkButton}>
            <WbSunnyIcon fontSize='large'/>
        </IconButton>
      )

    if (nChange.approvedBy(Meteor.userId()))
      return (
        <IconButton className={classes.okButton + ' ' + classes.approvedOkButton}
          onClick={this.dontApproveNchange}>
            <ThumbUpIcon fontSize='large'/>
        </IconButton>
      )
    return (
      <IconButton className={classes.okButton}
        disabled={!nChange.nchangerCanApprove(Meteor.userId())}
        onClick={this.approveNchange}>
          <ThumbUpOutlinedIcon fontSize='large'/>
      </IconButton>
    )
  }

  render() {
    const { nChange, nChangerId, classes, onClick, selected } = this.props;

    return (
      <Paper className={classnames(classes.root, selected && classes.selected)} 
        onClick={() => { onClick(nChange) }}>
        <div className={classes.itemList}>
          <div className={classes.animatedBackground}></div>
          { this.renderThings(nChange.getNchangerOutputActions(nChangerId),
              this.onOutputItemClick, nChangerId) }
        </div>
        { this.renderMiddleButton() }
        <div className={classes.itemList + ' ' + classes.listOnTheRight} >
          <div className={classes.animatedBackground + ' ' +
            classes.animatedBackgroundRight}></div>
          { this.renderThings(nChange.getNchangerInputActions(nChangerId),
              this.onInputItemClick) }
        </div>
      </Paper>
    );
  }
}

export default withTracker((props) => {
  return { props };
})(withRouter(withStyles(styles)(NChangeInList)));
