import { Meteor } from 'meteor/meteor';
import '../imports/api/items.js';
import { createBasicData } from '../imports/startup/createBasicData.js';

Meteor.startup(() => {
  // If we are not running tests we insert some basic documents in the database
  if(!Meteor.isAppTest) createBasicData();
  //Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://hand-raiser-evmipmlnls.now.sh/';
});

Accounts.validateNewUser(function(user){
  return true;
  //if(!user.services.google) return true;
});

Accounts.validateLoginAttempt(function(user){
  return true;
});
