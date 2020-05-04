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

const styles = {
  root: {

  },
  userImage: {
    height: '45px',
    width: '45px',
    borderRadius: '50%',
    border: '1px solid black'
  },
  isLoggedUser: {
    border: '3px solid yellow',
    height: '55px',
    width: '55px',
  },
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
    const { nChanger, thumbsUp, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    const user_image = nChanger && nChanger.services && nChanger.services.google
     && nChanger.services.google.picture;

    let pic_classes = classes.userImage;
    if (nChanger._id == Meteor.userId())
      pic_classes += ' ' + classes.isLoggedUser;

    return (
      <div className={classes.root }>
        <IconButton edge="start" color="inherit" aria-label="menu"
          onClick={this.props.onClick}>
          {
            user_image ?
              <img src= {user_image} className={pic_classes} /> :
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
  const { nChangerId } = props;
  Meteor.subscribe('nchangers_list', {_id: nChangerId});
  const n_changer = Meteor.users.findOne({_id: nChangerId});

  return {
    loading: !n_changer,
    nChanger: n_changer
  };
})
(withRouter(withStyles(styles)(NChangerAvatar)));
