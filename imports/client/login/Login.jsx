import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginBox from './LoginBox';
import ResetPasswordBox from './ResetPasswordBox';
import RegisterBox from './RegisterBox';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, Route, Switch, Link} from 'react-router-dom';
const styles = {
  background: {
    minHeight: '100vh',
    width: '100%',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formItems: {
    width: '40%',
    minWidth: '14rem',
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
    if (Meteor.user() || Meteor.loggingIn()) {
      return (<Redirect to='/' />);
    }
    return (
      <div className={this.props.classes.background}>
        <div className={this.props.classes.formItems}>
          <div>
            <Switch>
              <Route exact path="/login">
                <LoginBox/>
              </Route>
              <Route path="/login/register">
                <RegisterBox/>
              </Route>
              <Route path="/login/recover">
                <ResetPasswordBox/>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
};

export default withStyles(styles)(Login);
