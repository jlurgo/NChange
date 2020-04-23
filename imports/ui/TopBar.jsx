import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { Accounts } from 'meteor/accounts-base';
import { withRouter } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = {
  root: {
  },
  linkContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  link: {
    color: 'white',
    cursor: 'pointer'
  },
  separator: {
    marginLeft: '10px',
    marginRight: '10px',
    display: 'inline'
  },
  selectedLink: {
    fontWeight: 'bold'
  }
};

const sections = {
  'nthings': {label: 'NThings', url: '/nthings'},
  'nchanges': {label: 'NChanges', url: '/nchanges'}
}

class TopBar extends Component {

  state = {
    selectedSectionKey: 'nthings'
  }

  handleSectionClick = (section_key) => {
    this.props.history.push(sections[section_key].url);
    this.setState({
      selectedSectionKey: section_key
    });
  }

  renderLink = (section_key) => {
    const section = sections[section_key];
    const { classes } = this.props;
    const is_selected = this.props.location.pathname.startsWith(section.url);
    return (
      <Typography
        onClick={()=> this.handleSectionClick(section_key)}
        variant="h6"
        className={classes.link + ' ' + (is_selected ? classes.selectedLink : '')}>
        {section.label}
      </Typography>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className= {classes.menuButton}>
          <Toolbar>
            <span className={classes.linkContainer}>
              {this.renderLink('nthings')}
              <Typography variant="h6" className={classes.separator}>
                |
              </Typography>
              {this.renderLink('nchanges')}
            </span>
            <IconButton edge="start" color="inherit" aria-label="menu"
              onClick={()=>{
                Accounts.logout();
              }}>
              <AccountCircleOutlinedIcon />
            </IconButton>
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
})(withRouter(withStyles(styles)(TopBar)));
