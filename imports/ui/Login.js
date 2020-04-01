import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { browserHistory } from 'react-router';
import { Redirect } from 'react-router';


export default class Login extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (Meteor.userId()) { return <Redirect to='/' />}
    return (
      <div className="login-buttons-landing">
        <AccountsUIWrapper />
      </div>
    );
  }
};
