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
import { Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';

import NChangerAvatar from './NChangerAvatar'

const styles = {
  root: {
    flex: '0 0 auto'
  },
  linkContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  link: {
    color: 'white',
    cursor: 'pointer',
    width: '81px'
  },
  separator: {
    marginLeft: '10px',
    marginRight: '10px',
    display: 'inline'
  },
  selectedLink: {
    fontWeight: 'bold'
  },
  userAvatar: {
    border: '2px solid white'
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
            <NChangerAvatar onClick={()=>{Accounts.logout()}} nChangerId={Meteor.user()._id}/>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withTracker((props) => {
  const user_sub = Meteor.subscribe('own_user');
  return {
    loading: !user_sub.ready(),
    currentUser: Meteor.user()
  };
})(withRouter(withStyles(styles)(TopBar)));
