import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { withSubscriptions } from './WithSubscriptions';
import TopBar from './TopBar';
import ItemFinder from './ItemFinder';

const styles = {
  root: {
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'stretch',
    backgroundColor: 'white',
  },
  finder: {
    flexGrow: 1,
    flexShrink: 1
  }
};

// App component - represents the whole app
class App extends Component {

  render() {
    return (
      <div className={this.props.classes.root}>
        <TopBar/>
        <ItemFinder classes={{root: this.props.classes.finder}}/>
      </div>
    );
  }
}

export default withStyles(styles)(App);
