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
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import SwipeableViews from 'react-swipeable-views';
import ResizeDetector  from 'react-resize-detector';

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
  },
  addNchangerButton: {
    flex: '0 0 auto',
    marginRight: '10px'
  },
  leaveNchangeButton: {
    flex: '0 0 auto',
    marginRight: '5px'
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
  }
};

//
class NChangeDetail extends Component {

  state = {
    selectedNchanger: 'all',
    showChooseNchangerDialog: false
  }

  constructor() {
    super();
    this.rootRef = React.createRef();
  };

  onThingPlusButtonClick = (item) => {
    const { nchange } = this.props;
    if(item.owner == Meteor.userId()) {
      // offer
      const other_nchangers = _.filter(nchange.nChangers, (nchanger) => {
        return nchanger !== Meteor.userId();
      });
      if(other_nchangers.length>1){
        this.setState({
          showChooseNchangerDialog: true,
          nThingToOffer: item
        });
      } else {
        this.offerThingToNchanger(other_nchangers[0], item);
      }
      return;
    }

    // take
    const qty = nchange.thingQtyTakenBy(item._id, Meteor.userId()) + 1;
    Meteor.call('nchanges.takeItem', nchange._id, item._id, qty);
  }

  onNchangerSelectedToOffer = (nchanger_id) => {
    const { nThingToOffer } = this.state;
    this.offerThingToNchanger(nchanger_id, nThingToOffer);
  }

  offerThingToNchanger = (nchanger_id, item) => {
    const { nchange } = this.props;
    const current_take_action = _.findWhere(nchange.detail, {
      nThing: item._id, from: item.owner, action: 'take', user: nchanger_id
    });
    const qty = current_take_action ? (current_take_action.qty || 1) + 1 : 1;
    Meteor.call('nchanges.offerItem', nchange._id, item._id, nchanger_id, qty);
  }

  closeChooseNchangerDialog = ( ) => {
    this.setState({showChooseNchangerDialog: false, nchangerMail: ''});
  }

  addNChanger = (nchanger_id) => {
    const { nchange } = this.props;
    Meteor.call('nchanges.add_nchanger', nchange._id, nchanger_id,
      (err, res) => {
        if (err) alert('nChanger no encontrado');
      });
  }

  sendMessage = (message) => {
    Meteor.call('nchanges.new_chat_message', this.props.nchange._id, message);
  }

  handleNchangerClick = (nchanger_id) => {
    const { nchange } = this.props;
    this.setState({
      selectedNchanger: nchanger_id,
      thingsFilter: { owner: nchanger_id }
    });
  }

  handleShowAllButtonClick = () => {
    const { nchange } = this.props;
    this.setState({
      selectedNchanger: 'all',
      thingsFilter: { owner:
        { $in: nchange.nChangers}
      }
    });
  }

  getItemStock = (nthing) => {
    const { nchange } = this.props;
    return nchange.getRemainingThingStock(nthing);
  }

  onResize = (width) => {
    this.setState({
      width
    })
  }

  render() {
    const { nchange, loading, classes, history } = this.props;
    const { showChooseNchangerDialog, nThingToOffer, thingsFilter,
      width } = this.state;

    if (loading) return <div>Loading...</div>
    const user_id = Meteor.userId();

    if (!thingsFilter) {
      this.setState({
        selectedNchanger: 'all',
        thingsFilter: { owner:
          { $in: nchange.nChangers}
        }
      });
      return <div>Loading...</div>
    }

    // if an item gets out of stock we close the choose nchanger mini Dialog
    nThingToOffer && showChooseNchangerDialog &&
      nchange.getRemainingThingStock(nThingToOffer) <= 0 &&
      this.closeChooseNchangerDialog();

    const use_slider = width<800;
    return (
      <div className={classes.root } ref={this.rootRef}>
        <NChangeInList
          key={nchange._id} nchange={nchange}
          classes={{root: classes.detailBar}}
        />
        <div className={classes.bottomSection}>
          {use_slider && <SwipeableViews slideClassName={classes.slider}
            containerStyle={{ flex: '1 1 auto'}}
            style={{ display: 'flex', flexDirection: 'column'}} enableMouseEvents>
              {this.renderActivitySection()}
              {!nchange.approved && this.renderThingsSection()}
            </SwipeableViews>
          }
          {!use_slider && this.renderActivitySection()}
          {!use_slider && !nchange.approved && this.renderThingsSection()}
        </div>
        <ResizeDetector handleWidth onResize={this.onResize}
          targetDomEl={this.rootRef.current} />
      </div>
    );
  }

  renderActivitySection = () => {
    const { nchange, classes } = this.props;
    return (
      <div className={classes.historySection}>
        <NChangeActivity activity={nchange.activity}/>
        <SendChatMessageBox onSend={this.sendMessage}/>
      </div>
    );
  }

  renderThingsSection = () => {
    const { nchange, loading, classes, history } = this.props;
    const { showChooseNchangerDialog, nThingToOffer, thingsFilter } = this.state;
    const user_id = Meteor.userId();
    return (
      <div className={classes.thingsSection}>
        <div className={classes.nThings}>
          {showChooseNchangerDialog ?
            <div className={classes.itemChoosingNchangerToOffer}>
              {this.renderChooseNchangerDialog()}
              <ItemInList key={nThingToOffer._id} onClick={()=>{}}
                item={nThingToOffer} getItemStock={this.getItemStock}/>
            </div> :
            <ItemList filter={thingsFilter} getItemStock={this.getItemStock}
              onThingPlusButtonClick={this.onThingPlusButtonClick}
              classes={{root: classes.listRoot}}/>
          }
        </div>
        <div className={classes.nChangers}>
          {this.renderShowAllButton()}
          {this.renderNChanger(user_id)}
          <div className={classes.nChangersList}>
          {
            _.without(nchange.nChangers, user_id).map(this.renderNChanger)
          }
          </div>
          <AddNChangerButton classes={{ root: classes.addNchangerButton}}
            excludedNChangers={nchange.nChangers} onSelect={this.addNChanger}/>
          <LeaveNChangeButton nchange_id={nchange._id}
            classes={{ root: classes.leaveNchangeButton}}/>
        </div>
      </div>
    );
  }

  renderNChanger = (nchanger_id) => {
    const { nchange, classes } = this.props;
    return (
      <NChangerAvatar nChangerId={nchanger_id} key={nchanger_id}
        thumbsUp={nchange.approvedBy(nchanger_id)}
        onClick={this.handleNchangerClick}
        selected={this.state.selectedNchanger == nchanger_id}/>
    );
  }

  renderShowAllButton = (n_changer_id) => {
    const { nchange, classes  } = this.props;
    const is_selected = this.state.selectedNchanger == 'all';
    let iconRootClass = classes.showAllButton;
    iconRootClass += is_selected ? (' ' + classes.showAllButtonSelected) : '';
    return (
      <div>
        <IconButton onClick={this.handleShowAllButtonClick}
          classes={{root: iconRootClass}}>
          <GroupIcon fontSize= 'large'/>
        </IconButton>
      </div>
    );
  }

  renderChooseNchangerDialog = () => {
    const { nchange, classes } = this.props;
    const { showChooseNchangerDialog } = this.state;

    return (
      <div className={classes.nChangers + ' ' + classes.chooseNchangerDialog}>
        <Typography noWrap variant="h5">
          A quien?
        </Typography>
        {
          _.without(nchange.nChangers, Meteor.userId()).map((nchanger_id) => {
            return (
            <NChangerAvatar nChangerId={nchanger_id} key={nchanger_id}
              onClick={this.onNchangerSelectedToOffer}/>
            );
          })
        }
        <IconButton onClick={this.closeChooseNchangerDialog}
          style={{color: 'white'}}>
          <CloseIcon fontSize= 'small'/>
        </IconButton>
      </div>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.match.params.id;
  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  if (!nchange_sub.ready()) return { loading: true };
  const n_change = NChanges.findOne({_id: nchange_id});
  return {
    nchange: new NChange(n_change)
  };
})
(withStyles(styles)(NChangeDetail)));
