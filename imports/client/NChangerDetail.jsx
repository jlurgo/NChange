import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import ItemList from './ItemList';
import EditableTextField from './EditableTextField';
import SelectPicButton from "./SelectPicButton";
import NThingDetail from "./NThingDetail";

import { Items } from "../shared/collections";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  listRoot: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100px',
    overflowY: 'auto',
  },
  selectPicButton: {
    position: 'absolute',
    bottom: '0px',
    left: '30vh'
  },
  addButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  },
  topSection: {
    flex: '0 0 auto',
    display: 'flex',
    padding: '5px',
    position: 'relative'
  },
  userImage: {
    height: '300px',
    width: '300px',
    borderRadius: '5px',
    flex: '0 0 auto',
    maxHeight: '30vh',
    maxWidth: '30vh',
    objectFit: 'cover'
  },
  userDataContainer: {
    flex: '1 1 auto',
    display: 'flex',
    padding: '10px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
};

//
class NChangerDetail extends Component {

  state = {
    showAddThingDialog: false
  }

  addThing = () => {
    const { history } = this.props;
    this.setState({
      showAddThingDialog: true
    });
  }

  updateUserName = (new_user_name, on_error_cb) => {
    Meteor.call('users.setUserName', new_user_name, (err) => {
      err && on_error_cb(err);
    });
  }

  updateFullName = (new_full_name, on_error_cb) => {
    Meteor.call('users.setFullName', new_full_name, (err) => {
      err && on_error_cb(err);
    });
  }

  selectPic = (url) => {
    Meteor.call('users.setPic', url);
  }

  handleAddThingClose = () => {
    this.setState({
      showAddThingDialog: false,
    });
  }

  render() {
    const { nChanger, inEditMode, loading, classes, history } = this.props;
    const { showAddThingDialog } = this.state;
    if (loading) return <div>Loading...</div>

    return (
      <Paper classes={{ root: classes.root }} id='drawer-container'>
        <div className={classes.topSection}>
          <img src= {nChanger.pic} className={classes.userImage}/>
          <SelectPicButton onSelect={this.selectPic}
            classes={{ button: classes.selectPicButton }}/>
          <div className={classes.userDataContainer}>
            <div>
              <EditableTextField value={nChanger.userName}
                label='Nombre de usuario' editable={inEditMode} size='5'
                onChange={this.updateUserName}/>
              <EditableTextField value={nChanger.fullName}
                label='Nombre completo' editable={inEditMode} size='5'
                onChange={this.updateFullName}/>
            </div>
            { inEditMode &&
              <Button onClick={()=>{Accounts.logout()}} color="secondary">
                log out
              </Button>
            }
          </div>
        </div>
        <ItemList filter={{$or: [{ owner: nChanger._id}, { guardian: nChanger._id}]}}
          showItemsNewNchangeButton
          classes={{root: classes.listRoot}}/>
        { inEditMode &&
          <Fab onClick={this.addThing} className={classes.addButton} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        }
        <NThingDetail open={showAddThingDialog} thingId="new" onClose={this.handleAddThingClose}/>
      </Paper>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchanger_id = props.match.params.id

  const item_sub = Meteor.subscribe('nchanger_detail', nchanger_id);
  if (!item_sub.ready())
    return {
      loading: true
    }

  const nchanger = Meteor.users.findOne({_id: nchanger_id});
  return {
    nChanger: nchanger,
    inEditMode: nchanger_id == Meteor.userId(),
  };
})
(withStyles(styles)(NChangerDetail)));
