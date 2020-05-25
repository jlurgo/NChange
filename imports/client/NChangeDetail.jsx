import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import NChange from "../shared/NChange"

import { NChanges } from "../shared/collections";

import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import SwipeableViews from 'react-swipeable-views';
import ResizeDetector  from 'react-resize-detector';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import NChangeInList from './NChangeInList';
import NChangerAvatar from './NChangerAvatar';
import AddNChangerButton from './AddNChangerButton';
import ItemList from './ItemList';
import ItemInList from './ItemInList';
import NChangeActivity from './NChangeActivity';
import SendChatMessageBox from './SendChatMessageBox';
import LeaveNChangeButton from './LeaveNChangeButton';


const styles = {
  root: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  detailBar: {
    flex: '0 0 auto'
  },
  bottomSection: {
    flex: '1 1 auto',
    height: '100px',
    display: 'flex',
    overflowX: 'auto'
  },
  slider: {
    flex: '1 1 auto',
    display: 'flex',
  },
  historySection: {
    flex: '1 1 30%',
    display: 'flex',
    flexDirection: 'column',
    marginRight: '5px',
    height: '100%'
  },
  thingsSection: {
    flex: '1 1 70%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  nChangers: {
    flex: '0 0 auto',
    display: 'flex',
    paddingLeft: '15px',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    height: '79px'
  },
  nChangersList: {
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto'
  },
  menuButton: {
    flex: '0 0 auto',
    backgroundColor: '#9d9d9d61 !important'
  },
  addNchangerButton: {
    marginLeft: '10px'
  },
  leaveNchangeButton: {
    marginLeft: '10px'
  },
  nThings: {
    flex: '1 1 auto',
    height: '100px',
    overflowY: 'auto'
  },
  showAllButton: {
    height:' 69px',
    width: '69px',
  },
  showAllButtonSelected: {
    background: '-webkit-radial-gradient(circle, rgba(226,237,2,0) 40%, rgb(142, 193, 218) 50%, rgba(226,237,2,0) 70%)'
  },
  itemChoosingNchangerToOffer: {
    position: 'relative',
    flex: '1 1 100px',
    width: '100%',
    maxWidth: '400px'
  },
  chooseNchangerDialog: {
    position: 'absolute',
    backgroundColor: '#808080e8',
    display: 'flex',
    top: '13px',
    left: '9px',
    right: '0px',
    zIndex: '10',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white'
  },
  showActivityButton: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'yellow !important'
  },
};

//
class NChangeDetail extends Component {

  state = {
    selectedNchanger: Meteor.userId(),
    showActivity: false,
    openMenu: false
  }

  constructor() {
    super();
    this.rootRef = React.createRef();
  };

  addNChanger = (nchanger_id) => {
    const { nChange } = this.props;
    Meteor.call('nchanges.add_nchanger', nChange._id, nchanger_id,
      (err, res) => {
        if (err) alert('nChanger no encontrado');
      });
  }

  sendMessage = (message) => {
    Meteor.call('nchanges.new_chat_message', this.props.nchange._id, message);
  }

  handleNchangerClick = (nchanger_id) => {
    this.setState({
      selectedNchanger: nchanger_id
    });
  }

  onResize = (width) => {
    this.setState({
      smallScreen: width<800
    })
  }

  showActivity = () => {
    this.setState({
      showActivity: !this.state.showActivity
    })
  }

  openMenu = (e) => {
    this.setState({
      openMenu: true,
      menuAnchor: e.currentTarget
    });
  }

  closeMenu = () => {
    this.setState({
      openMenu: false
    });
  }

  render() {
    const { nChange, loading, classes, history } = this.props;
    const { selectedNchanger, smallScreen, showActivity } = this.state;

    if (loading) return <div>Loading...</div>
    const user_id = Meteor.userId();

    return (
      <div className={classes.root } ref={this.rootRef}>
        {this.renderNchangersSection()}
        <NChangeInList
          nChangerId={selectedNchanger} key={nChange._id} nchange={nChange}
          classes={{root: classes.detailBar}} enableItemRemoving={true}
        />
        <div className={classes.bottomSection}>
          {(!smallScreen || showActivity || nChange.approved) &&
            this.renderActivitySection()}
          {(!smallScreen || !showActivity) && !nChange.approved && this.renderThingsSection()}
          { smallScreen && !nChange.approved &&
            <IconButton className={classes.showActivityButton} onClick={this.showActivity}>
              <ChatIcon fontSize= 'large'/>
            </IconButton>
          }
        </div>
        <ResizeDetector handleWidth onResize={this.onResize}
          targetDomEl={this.rootRef.current} />
      </div>
    );
  }

  renderActivitySection = () => {
    const { nChange, classes } = this.props;
    return (
      <div className={classes.historySection}>
        <NChangeActivity activity={nChange.activity}/>
        <SendChatMessageBox onSend={this.sendMessage}/>
      </div>
    );
  }

  renderThingsSection = () => {
    const { nChange, classes } = this.props;
    const { selectedNchanger } = this.state;
    const user_id = Meteor.userId();
    const thingsFilter = { owner:
      { $in: nChange.getOtherNchangersId(selectedNchanger)}
    }
    return (
      <div className={classes.thingsSection}>
        <div className={classes.nThings}>
          <ItemList filter={thingsFilter} renderThing={this.renderThingInList}
            classes={{root: classes.listRoot}}/>
        </div>
      </div>
    );
  }

  renderThingInList = (nthing) => {
    const { nChange, classes } = this.props;
    const { selectedNchanger } = this.state;

    return (
      <ItemInList key={nthing._id} item={nthing}
        showQtyButton={true} nChange={nChange} nChangerId={selectedNchanger}/>
    );
  }

  renderNchangersSection = () => {
    const { nChange, classes } = this.props;
    const { openMenu, menuAnchor } = this.state;
    return (
      <div className={classes.nChangers}>
        <div className={classes.nChangersList}>
          {this.renderNChanger(Meteor.userId())}
          {
          _.without(nChange.nChangers, Meteor.userId())
            .map(this.renderNChanger)
          }
        </div>
        {!nChange.approved &&
          <IconButton className={classes.menuButton} onClick={this.openMenu}>
            <MenuIcon fontSize= 'small'/>
          </IconButton>
        }
        <Menu
          id="customized-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={openMenu}
          onClose={this.closeMenu}
        >
          <MenuItem>
            <ListItemText primary="agregar participante" />
            <ListItemIcon>
              <AddNChangerButton classes={{ root: classes.addNchangerButton}}
              excludedNChangers={nChange.nChangers} onSelect={this.addNChanger}/>
            </ListItemIcon>
          </MenuItem>
          <MenuItem>
            <ListItemText primary="abandonar nchange" />
            <ListItemIcon>
              <LeaveNChangeButton nchange_id={nChange._id}
              classes={{ root: classes.leaveNchangeButton}}/>
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </div>
    );
  }

  renderNChanger = (nchanger_id) => {
    const { nChange, classes } = this.props;
    return (
      <NChangerAvatar nChangerId={nchanger_id} key={nchanger_id}
        thumbsUp={nChange.approvedBy(nchanger_id)}
        onClick={this.handleNchangerClick}
        selected={this.state.selectedNchanger == nchanger_id}/>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.match.params.id;
  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  if (!nchange_sub.ready()) return { loading: true };
  const n_change = NChanges.findOne({_id: nchange_id});
  return {
    nChange: new NChange(n_change)
  };
})
(withStyles(styles)(NChangeDetail)));
