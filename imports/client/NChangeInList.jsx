import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import SendIcon from '@material-ui/icons/Send';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import ItemInChange from './ItemInChange';
import NChangerAvatar from './NChangerAvatar';
import NThingIcon from './NThingIcon';

import { Items } from "../shared/collections";

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
    backgroundColor: 'unset'
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
  approvedOkButton: {
    color: '#41b53f',
  },
  finishedOkButton : {
    color: 'orange'
  }
};


// Item component - represents a single todo item
class NChangeInList extends Component {

  approveNchange = (e) => {
    Meteor.call('nchanges.approve', this.props.nchange._id);
    e.stopPropagation();
  }

  dontApproveNchange = (e) => {
    Meteor.call('nchanges.dont_approve', this.props.nchange._id);
    e.stopPropagation();
  }

  sendNchange = (e) => {
    Meteor.call('nchanges.send', this.props.nchange._id);
    e.stopPropagation();
  }

  onInputItemClick = (item_id) => {
    const { nchange } = this.props;
    const take_action = _.where(nchange.detail,
      { action: 'take', nThing: item_id, user: Meteor.userId()});
    Meteor.call('nchanges.releaseItem', this.props.nchange._id, item_id,
      take_action.from);
  }

  onOutputItemClick = (item_id) => {
    const { nchange } = this.props;
    const take_action = _.findWhere(nchange.detail,
      { action: 'take', nThing: item_id, from: Meteor.userId()});
    Meteor.call('nchanges.retrieveItem', this.props.nchange._id, item_id,
      take_action.user);
  }

  renderItems(items, onClick) {
    return items.map((item) => {
      return (
        <ItemInChange
          key={item.nThing}
          itemInChange={item}
          onClick={onClick}
        />
      );
    });
  }

  renderOkButton = (user_gives_and_receives) => {
    const { nchange, classes } = this.props;

    if (nchange.draft)
      return (
        <IconButton className={classes.okButton} onClick={this.sendNchange}>
            <SendIcon fontSize='large'/>
        </IconButton>
      )

    if (nchange.approved)
      return (
        <IconButton className={classes.okButton + ' ' + classes.finishedOkButton}>
            <WbSunnyIcon fontSize='large'/>
        </IconButton>
      )

    const approved_by_me = _.contains(nchange.approvals, Meteor.userId());
    if (approved_by_me)
      return (
        <IconButton className={classes.okButton + ' ' + classes.approvedOkButton}
          onClick={this.dontApproveNchange}>
            <ThumbUpIcon fontSize='large'/>
        </IconButton>
      )
    return (
      <IconButton className={classes.okButton} disabled={!user_gives_and_receives}
        onClick={this.approveNchange}>
          <ThumbUpOutlinedIcon fontSize='large'/>
      </IconButton>
    )
  }

  render() {
    const { nchange, classes, history } = this.props;
    const user_input_items = _.where(nchange.detail,
      { action: 'take', user: Meteor.userId()});

    const user_output_items = _.where(nchange.detail,
      { action: 'take', from: Meteor.userId()});

    const user_gives_and_receives =
      user_input_items.length > 0 && user_output_items.length > 0

    return (
      <Paper className={classes.root} onClick={()=>{
          history.push(`/nchangedetail/${nchange._id}`)
        }} >
          <div className={classes.itemList}>
            <div className={classes.animatedBackground}></div>
            { this.renderItems(user_output_items, this.onOutputItemClick) }
          </div>
          { this.renderOkButton(user_gives_and_receives) }
          <div className={classes.itemList + ' ' + classes.listOnTheRight} >
            <div className={classes.animatedBackground + ' ' +
              classes.animatedBackgroundRight}></div>
            { this.renderItems(user_input_items, this.onInputItemClick) }
          </div>
      </Paper>
    );
  }
}

export default withTracker((props) => {
  return { props };
})(withRouter(withStyles(styles)(NChangeInList)));
