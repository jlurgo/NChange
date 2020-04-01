import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import './main.html';
import '../imports/api/turnsToSpeak.js'
import '../imports/startup/accounts-config.js';
import { renderRoutes } from '../imports/startup/client/routes.js';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});

Accounts.onLogin(function(user){
  render(renderRoutes(), document.getElementById('render-target'));
});
