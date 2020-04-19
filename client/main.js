import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App';
// import { renderRoutes } from '../imports/startup/client/routes.js';


Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});

// Meteor.startup(() => {
//   render(renderRoutes(), document.getElementById('render-target'));
// });
//
// Accounts.onLogin(function(user){
//   render(renderRoutes(), document.getElementById('render-target'));
// });