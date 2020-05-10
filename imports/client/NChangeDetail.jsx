import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { NChanges } from "../shared/collections";

import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import IconButton from '@material-ui/core/IconButton';

import NChangeInList from './NChangeInList';
import NChangerAvatar from './NChangerAvatar';
import AddNChangerButton from './AddNChangerButton';
import ItemList from './ItemList';
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
  historySection: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    marginRight: '5px',
    maxWidth: '500px',
  },
  thingsSection: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '5px'
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
  }
};

//
class NChangeDetail extends Component {

  state = {
    selectedNchanger: 'all',
  }

  handleOnItemClick = (item) => {
    const { nchange } = this.props;
    if(item.owner == Meteor.userId()) {
      return;
    }
    Meteor.call('nchanges.takeItem', nchange._id, item._id);
  }

  addNChanger = (nchanger_mail) => {
    const { nchange } = this.props;
    Meteor.call('nchanges.add_nchanger', nchange._id, nchanger_mail,
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

  render() {
    const { nchange, loading, classes, history } = this.props;
    const { thingsFilter } = this.state;
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

    // we filter out from the available things list the items already visible
    // in the top bar
    const user_input_items = _.chain(nchange.detail)
      .where({ action: 'take', user: Meteor.userId()})
      .pluck('nThing')
      .value();

    const user_output_items = _.chain(nchange.detail)
      .where({ action: 'take', from: Meteor.userId()})
      .pluck('nThing')
      .value();

    const all_taken_things = _.union(user_input_items, user_output_items)

    const new_filter = all_taken_things.length > 0 ?
      _.extend({}, thingsFilter, {_id: { $nin: all_taken_things}}) :
      thingsFilter;

    return (
      <div className={classes.root }>
        <NChangeInList
          key={nchange._id} nchange={nchange}
          classes={{root: classes.detailBar}}
        />
        <div className={classes.bottomSection}>
          <div className={classes.historySection}>
            <NChangeActivity activity={nchange.activity}/>
            <SendChatMessageBox onSend={this.sendMessage}/>
          </div>
          { !nchange.approved &&
            <div className={classes.thingsSection}>
              <div className={classes.nThings}>
                <ItemList filter={new_filter}
                  onItemClick={this.handleOnItemClick}
                  classes={{root: classes.listRoot}}/>
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
                  onSelect={this.addNChanger}/>
                <LeaveNChangeButton nchange_id={nchange._id}
                  classes={{ root: classes.leaveNchangeButton}}/>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

  renderNChanger = (n_changer_id) => {
    const { nchange, classes } = this.props;
    const approved_by_user = _.contains(nchange.approvals, n_changer_id);
    return (
      <NChangerAvatar nChangerId={n_changer_id} key={n_changer_id}
        thumbsUp={approved_by_user} onClick={this.handleNchangerClick}
        selected={this.state.selectedNchanger == n_changer_id}/>
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
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.match.params.id;
  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  if (!nchange_sub.ready()) return { loading: true };
  const n_change = NChanges.findOne({_id: nchange_id});
  return {
    nchange: n_change
  };
})
(withStyles(styles)(NChangeDetail)));
