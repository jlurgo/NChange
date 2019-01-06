import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import App from '../../ui/App.js';
import Login from '../../ui/Login.js';

const browserHistory = createBrowserHistory();
function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
export const renderRoutes = () => (
  <Router history={browserHistory} >
    <div>
      <Route path="/" exact component={Login} />
    </div>
  </Router>
);
