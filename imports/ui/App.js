import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import _ from 'lodash';

import { TurnsToSpeak, Admins } from '../api/turnsToSpeak.js';

import TurnToSpeak from './TurnToSpeak.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import Select from 'react-select';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    Meteor.call('turns_to_speak.insert', this.props.currentUser._id);
  }

  renderTurns() {
    return this.props.turnsToSpeak.map((turn) => {
      return (
        <TurnToSpeak
          key={turn._id}
          turn={turn}
          loggedUserIsAdmin={this.props.loggedUserIsAdmin}
        />
      );
    });
  }

  render() {
    if (!Meteor.userId()) { return <Redirect to='/login' />}

    return (
      <div className="container container-fluid app">
        <header>
          <div className= "row">
            <h2 className="col">Speakers({this.props.turnsCount})</h2>
            <AccountsUIWrapper />
          </div>
          { (this.props.currentUser && this.props.userDidntRiseHand) ?
            <form className="new-turn" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type = "submit"
                ref = "rise_hand_btn"
                value = "raise your hand!"
              />
            </form> : ''
          }

          { this.props.loggedUserIsAdmin ?
            <Select
              className = "select_users"
              placeholder = "add speaker to queue"
              value = {null}
              filterOption={(user, search_val)=>{
                  return _.find(this.props.unqueuedUsers,
                    function(usr){
                      return (usr._id == user.value) && (_.includes(usr.profile.name.toLowerCase(), search_val.toLowerCase()));
                    })? true : false;
              }}
              options = {
                this.props.unqueuedUsers.map((usr)=>{
                  const usrName = usr.username ? usr.username : usr.profile.name;
                  let label = usrName;
                  if(usr.services)
                    label = <span className = "user_in_select"> <img src= {usr.services.google.picture}/> <label> {usrName} </label> </span>
                  return {
                    value: usr._id,
                    label: label
                  }
                })
              }
              onChange = {(selectedOption) => {
                Meteor.call('turns_to_speak.insert', selectedOption.value);
              }}
            />: ''
          }
        </header>

        <ul className="list-group list-group-flush">
          {this.renderTurns()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('turns_to_speak');
  Meteor.subscribe('admins');
  Meteor.subscribe('user_list');

  let user_id = -1
  let user_is_admin = false;
  if(Meteor.user()) {
    user_id = Meteor.user()._id;
    user_is_admin = Admins.findOne({userId: Meteor.user()._id})? true : false;
  }
  let turns = TurnsToSpeak.find({}, { sort: { createdAt: 1 } });
  return {
    turnsToSpeak: turns.fetch(),
    turnsCount: turns.count(),
    userDidntRiseHand: TurnsToSpeak.find({owner: user_id}).count()==0,
    currentUser: Meteor.user(),
    loggedUserIsAdmin: user_is_admin,
    unqueuedUsers: Meteor.users.find(
      {_id: {
          $nin: turns.fetch().map((turn) => {return turn.owner;})
      }},
      {sort: { 'profile.name': 1 }}
    )
    .fetch(),
  };
})(App);
