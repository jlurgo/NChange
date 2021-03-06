import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import { BrowserRouter as Router, Switch, Link, Redirect } from "react-router-dom";
import { Route } from "react-router";

import TopBar from './TopBar';
import Login from './login/Login.jsx';
import ItemExplorer from './ItemExplorer';
import NChangesExplorer from './NChangesExplorer';
import NThingDetail from './NThingDetail';
import NChangeDetail from './NChangeDetail';
import NChangerDetail from './NChangerDetail';

const styles = {
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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
      return <div>Loading...</div>
    }
    return (
      <Router>
        <div className={this.props.classes.root}>
          <Switch>
            <Route exact path="/">
              <Redirect to='/nthings'/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <PrivateRoute user={this.props.currentUser} path="/">
              <TopBar/>
              <Switch>
                <Route exact path="/nthingdetail/:id">
                  <NThingDetail classes={{root: this.props.classes.section}}/>
                </Route>
                <Route exact path="/nchangedetail/:id">
                  <NChangeDetail classes={{root: this.props.classes.section}}/>
                </Route>
                <Route exact path="/nchangerdetail/:id">
                  <NChangerDetail classes={{root: this.props.classes.section}}/>
                </Route>
                <Route path="/nthings">
                  <ItemExplorer classes={{root: this.props.classes.section}}/>
                </Route>
                <Route path="/nchanges">
                  <NChangesExplorer classes={{root: this.props.classes.section}}/>
                </Route>
              </Switch>
            </PrivateRoute>
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
