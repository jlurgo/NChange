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

import { Items } from "../shared/collections";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
  },
  listRoot: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100px',
    overflowY: 'auto',
  },
  addButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  },
  topSection: {
    flex: '0 0 auto',
    display: 'flex'
  },
  userImage: {
    height: '300px',
    width: '300px',
    borderRadius: '5px',
    flex: '0 0 auto',
    maxHeight: '30vh',
    maxWidth: '30vh',
  },
  userDataContainer: {
    flex: '1 1 auto',
    display: 'flex',
    padding: '10px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
};

//
class NChangerDetail extends Component {

  addThing = () => {
    const { history } = this.props;
    history.push(`/nthingdetail/new`);
  }

  render() {
    const { nChanger, inEditMode, loading, classes, history } = this.props;
    if (loading) return <div>Loading...</div>

    const user_image = nChanger && nChanger.services && nChanger.services.google
     && nChanger.services.google.picture;

    return (
      <Paper classes={{ root: classes.root }}>
        <div className={classes.topSection}>
          <img src= {user_image} className={classes.userImage} />
          <div className={classes.userDataContainer}>
            <Typography variant="h4">
              {`${nChanger.firstName} ${nChanger.lastName}` }
            </Typography>
            { inEditMode &&
              <Button onClick={()=>{Accounts.logout()}} color="secondary">
                log out
              </Button>
            }
          </div>
        </div>
        <Typography variant="h4">
          {`Inventario` }
        </Typography>
        <ItemList filter={{owner: nChanger._id}} showItemsDeleteButton={inEditMode}
          showItemsNchangeButton
          classes={{root: classes.listRoot}}/>
        { inEditMode &&
          <Fab onClick={this.addThing} className={classes.addButton} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        }
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
