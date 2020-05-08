import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

const styles = {
  root: {
    flex: '0 0 auto',
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    height: '79px',
    alignItems: 'center'
  },
};

//
class SendChatMessageBox extends Component {
  state = {
    message: ''
  }

  handleTextChange = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  handleKeyPress = (e) => {
    (e.keyCode == 13) && this.sendMessage();
  }

  sendMessage = () => {
    this.props.onSend(this.state.message);
    this.setState({
      message: ''
    });
  }

  render() {
    const { loading, classes, history } = this.props;

    return (
      <div className={classes.root }>
        <TextField value={this.state.message} fullWidth
          margin="dense" label="enviar un mensaje al nchange" type="text"
          variant="outlined" onChange={this.handleTextChange} 
          onKeyDown={this.handleKeyPress}/>
        <IconButton className={classes.removePicIcon} onClick={this.sendMessage}
          disabled={!this.state.message}>
           <SendIcon fontSize= 'large'/>
        </IconButton>
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})
(withRouter(withStyles(styles)(SendChatMessageBox)));
