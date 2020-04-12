import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Redirect, Route} from 'react-router';
import LoginBox from './LoginBox';
import ResetPasswordBox from './ResetPasswordBox';
import RegisterBox from './RegisterBox';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  background: {
    minHeight: '100vh',
    width: '100%',
    color: '#000',
    backgroundColor: '#000',
    backgroundImage: 'url("")',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formItems: {
    maxWidth: '30rem',
    borderRadius: '1rem',
    backgroundColor: 'rgba(17, 17, 17, .8)',
    padding: '2rem',
    color: '#ccc',
    fontSize: 'smaller',
  },
  formItemsImg: {
    lineHeight: '1.2',
    padding: '0 15px',
    position: 'relative',
    left: '20%',
    width: '60%',
  }
}

class Login extends Component {

  render() {
    if (this.props.currentUser) {
      return (<Redirect to='/' />);
    }
    return (
      <div className={this.props.classes.background}>
        <div className={this.props.classes.formItems}>
          <div>
            <Route exact path="/login" component={LoginBox}/>
            <Route path="/login/recover" component={ResetPasswordBox}/>
            <Route path="/login/register" component={RegisterBox}/>
          </div>
        </div>
      </div>
    );
  }
};

export default withTracker(() => {
  return {
    isLoggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
  }
})(withStyles(styles)(Login));
