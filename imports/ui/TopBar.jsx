import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'

const styles = {
  root: {
  },
  menuButton: {
    marginRight: '10px',
  },
  title: {
    flexGrow: 1,
  },
};

class TopBar extends Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" className= {classes.menuButton}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Items
            </Typography>
            <AccountsUIWrapper />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user(),
  };
})(withStyles(styles)(TopBar));
