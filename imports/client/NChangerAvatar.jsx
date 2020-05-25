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

const get_size = (property) => {
  let size = 45; // 'medium';
  if (property == 'small') size = 20;
  if (!isNaN(parseInt(property))) size = property;
  return size;
}

const styles = {
  root: {

  },
  userImage: props => ({
    height: `${get_size(props.size)}px`,
    width: `${get_size(props.size)}px`,
    borderRadius: '50%'
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
  render() {
    const { nChanger, thumbsUp, loading, classes, history, selected } = this.props;

    if (loading) return <div>Loading...</div>

    let pic_classes = classes.userImage;
    const is_logged_user = (nChanger._id == Meteor.userId());

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
          onClick={(e) => {
            e.stopPropagation();
            if (this.props.onClick) this.props.onClick(nChanger._id);
            else history.push(`/nchangerdetail/${nChanger._id}`);
          }}>
          {
            nChanger.pic ?
              <img src= {nChanger.pic} className={pic_classes} /> :
              <AccountCircleOutlinedIcon fontSize= 'large'/>
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
  Meteor.subscribe('nchangers_list', {_id: nChangerId});
  const n_changer = Meteor.users.findOne({_id: nChangerId});

  return {
    loading: !n_changer,
    nChanger: n_changer
  };
})
(withRouter(withStyles(styles)(NChangerAvatar)));
