import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import TopBar from './TopBar';
import Login from './login/Login.jsx';
import ItemExplorer from './ItemExplorer';
import TrokExplorer from './TrokExplorer';

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

const styles = {
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  section: {
    flexGrow: 1,
    flexShrink: 0,
    height: '100px'
  }
};

// function PrivateRoute({ user, children, ...rest }) {
class PrivateRoute extends Component {
  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={({ location }) =>
          this.props.user ? (
            this.props.children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
}


// App component - represents the whole app
class App extends Component {
  render() {
    if (this.props.isLoggingIn) {
      return <div></div>
    }
    return (
      <Router>
        <div className={this.props.classes.root}>
          <TopBar/>
          <Switch>
            <Route path="/login">
              <Login/>
            </Route>
            <PrivateRoute user={this.props.currentUser} path="/items">
              <ItemExplorer classes={{root: this.props.classes.section}}/>
            </PrivateRoute>
            <PrivateRoute user={this.props.currentUser} path="/troks">
              <TrokExplorer classes={{root: this.props.classes.section}}/>
            </PrivateRoute>
            <Route exact path="/">
              <Redirect
                to={{
                  pathname: "/items"
                }}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withTracker(() => {
  return {
    isLoggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
  }
})(withStyles(styles)(App));
