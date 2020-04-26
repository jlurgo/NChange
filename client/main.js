import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import './main.html';
// import '../imports/server/startup/accounts-config.js';
import App from '../imports/client/App';
// import { renderRoutes } from '../imports/startup/client/routes.js';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
