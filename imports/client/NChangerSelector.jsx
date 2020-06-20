import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';

import NChangerAvatar from './NChangerAvatar';


const styles = {
  root: {

  },
  menu: {
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column-reverse'
  }
};

//
class NChangerSelector extends Component {
  state = {
    showNchangerSelectList: false
  }

  openList = (nchanger_id, e) => {
    this.setState({
      showNchangerSelectList: true,
      menuAnchor: e.currentTarget
    });    
  }

  closeList = () => {
    this.setState({showNchangerSelectList: false});
  }

  handleSelect = (nchanger_id) => {
    this.props.onSelect && this.props.onSelect(nchanger_id);
    this.closeList();
  }

  render() {
    const { nChange, selectedNChangerId, showNChangeIcon, showWorldIcon, 
      showLoggedUser, classes } = this.props;
    const { showNchangerSelectList, menuAnchor } = this.state;
    
    return (
      <div className={ classes.root }>
        <NChangerAvatar nChangerId={selectedNChangerId} onClick={this.openList} size='30'/>
        <Menu
          anchorEl={menuAnchor}
          keepMounted
          open={showNchangerSelectList}
          onClose={this.close}
          classes={{paper: classes.menu, list: classes.menuList}}
        >
          { showWorldIcon && <NChangerAvatar nChangerId={'world'} onClick={this.handleSelect} size='30'/>}
          { showNChangeIcon && <NChangerAvatar nChangerId={'nchange'} onClick={this.handleSelect} size='30'/>}
          { showLoggedUser && <NChangerAvatar nChangerId={Meteor.userId()} onClick={this.handleSelect} size='30'/>}
          {
            _.without(nChange.nChangers, Meteor.userId()).map(this.renderNChanger)
          }
        </Menu>
      </div>
    );
  }

  renderNChanger = (nchanger_id) => {
    const { nChange, selectedNChangerId, classes } = this.props;
    return (
      <NChangerAvatar nChangerId={nchanger_id} key={nchanger_id}
        thumbsUp={nChange.approvedBy(nchanger_id)}
        onClick={this.handleSelect}
        selected={selectedNChangerId == nchanger_id}
        size='30'/>
    );
  }
}

export default withStyles(styles)(NChangerSelector);
