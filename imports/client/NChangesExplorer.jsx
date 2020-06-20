import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'

import { NChanges } from "../shared/collections";
import NChange from "../shared/NChange"

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import NChangesList from './NChangesList';
import NChangeDetail from './NChangeDetail';
import NChangeActivity from './NChangeActivity';
import SendChatMessageBox from './SendChatMessageBox';

const styles = {
  root: {
    display: 'flex',
    paddingTop: '5px',
  },
  nChangesList: {
    flex: '0 0 500px',
    overflowX: 'hidden',
    direction: 'rtl'
  },
  nChangeDetail: {
    flex: '1 1 auto',
    overflowX: 'hidden'
  },
  nChangeActivity: {
    flex: '0 0 400px',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  addButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  }
};

// App component - represents the whole app
class NChangesExplorer extends Component {
  state = {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.selectedNChangeId && !nextProps.loading) {
      return {
        selectedNChangeId: nextProps.nChanges[0]._id
      };
    }
  }

  addNChange = () => {
    const { history } = this.props;
    Meteor.call('nchanges.new', (error, nchange_id)=> {
      if (error) {
        console.warn(error);
        return;
      }
      this.setState({
        selectedNChangeId: nchange_id
      });
    });
  }

  sendMessage = (message) => {
    Meteor.call('nchanges.new_chat_message', this.props.nchange._id, message);
  }

  handleNChangeSelect = (nchange) => {
    this.setState({
      selectedNChangeId: nchange._id
    });
  }

  render() {
    const { classes, loading } = this.props;
    const { selectedNChangeId } = this.state;

    if (loading) return <div>Loading...</div>
    return (
      <div className={classes.root}>
        <div className={classes.nChangesList}>
          <NChangesList nChanges={this.props.nChanges} selectedNChangeId={selectedNChangeId} 
          onSelect={this.handleNChangeSelect}/>
          <Fab onClick={this.addNChange} className={classes.addButton}
            color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
        <NChangeDetail classes={{root: classes.nChangeDetail}} nChangeId={selectedNChangeId}/>
        <div className={classes.nChangeActivity}>
          <NChangeActivity nChangeId={selectedNChangeId}/>
          <SendChatMessageBox onSend={this.sendMessage}/>
        </div>
      </div>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchanges_sub = Meteor.subscribe('user_n_changes');
  return {
    loading: !nchanges_sub.ready(),
    nChanges: NChanges.find({}, {sort: { lastUpdated: -1 } }).map((nchange)=>{
      return new NChange(nchange)}),
  };
})(withStyles(styles)(NChangesExplorer)));
