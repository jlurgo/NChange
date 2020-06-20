import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PublicIcon from '@material-ui/icons/Public';
import GroupIcon from '@material-ui/icons/Group';

const get_size = (property) => {
  let size = 45; // 'medium';
  if (property == 'small') size = 20;
  if (property == 'medium') size = 35;
  if (!isNaN(parseInt(property))) size = property;
  return size;
}

const styles = {
  root: {

  },
  userImage: props => ({
    height: `${get_size(props.size)}px`,
    width: `${get_size(props.size)}px`,
    borderRadius: '50%',
    objectFit: 'cover'
  }),
  isLoggedUser: props => ({
    background: `-webkit-radial-gradient(circle,rgb(251, 255, 0) ${get_size(props.size)/2}px, rgba(226,237,2,0) ${get_size(props.size)/2 + 4}px)`
  }),
  isSelected: props => ({
    background: `-webkit-radial-gradient(circle,rgb(142, 193, 218) ${get_size(props.size)/2}px, rgba(226,237,2,0) ${get_size(props.size)/2 + 4}px)`
  }),
  thumbUp: {
    position: 'absolute',
    top: '10px',
    right: '3px',
    color: '#41b53f'
  }
};

//
class NChangerAvatar extends Component {

  handleClick = (e) => {
    const { nChangerId, nChanger, history } = this.props;
    e.stopPropagation();
    const nchanger_id = nChanger ? nChanger._id : nChangerId;
    if (this.props.onClick) this.props.onClick(nchanger_id, e);
    else history.push(`/nchangerdetail/${nchanger_id}`);
  }

  render() {
    const { nChangerId, nChanger, thumbsUp, loading, classes, selected } = this.props;

    if (loading) return <div>Loading...</div>

    let pic_classes = classes.userImage;
    const is_logged_user = nChanger && (nChanger._id == Meteor.userId());

    let button_class = '';
    if (is_logged_user){
      button_class = classes.isLoggedUser;
    }
    if (selected) {
      button_class = classes.isSelected;
    }

    return (
      <div className={classes.root }>
        <IconButton classes={{root: button_class}}
          onClick={this.handleClick}>
          {
            nChangerId == 'world' &&
            <PublicIcon fontSize= 'large'/>
          }
          {
            nChangerId == 'nchange' &&
            <GroupIcon fontSize= 'large'/>
          }
          {
            (nChanger && nChanger.pic) &&
              <img src= {nChanger.pic} className={pic_classes} /> 
          }
          {
            thumbsUp &&
              <ThumbUpIcon className={classes.thumbUp} fontSize= 'small'/>
          }
        </IconButton>
      </div>
    );
  }
}

export default withTracker((props) => {
  const { nChanger, nChangerId } = props;
  if(nChanger) {
    return {
      nChanger: nChanger
    };
  }
  if(nChangerId == 'world' || nChangerId == 'nchange') {
    return {
      nChangerId: nChangerId
    };
  }
  Meteor.subscribe('nchangers_list', {_id: nChangerId});
  const n_changer = Meteor.users.findOne({_id: nChangerId});

  return {
    loading: !n_changer,
    nChanger: n_changer
  };
})
(withRouter(withStyles(styles)(NChangerAvatar)));
