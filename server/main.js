import { Meteor } from 'meteor/meteor';
import '../imports/shared/collections.js';
import '../imports/server/items.js';
import '../imports/server/nchanges.js';
import '../imports/server/tags.js';
import '../imports/server/users.js';
// import { createBasicData } from '../imports/server/createBasicData.js';
import { startBusinessRules } from '../imports/server/startBusinessRules.js';

Meteor.startup(() => {
  //if(!Meteor.isAppTest) createBasicData();
  startBusinessRules();
});

Accounts.validateNewUser(function(user){
  return true;
  //if(!user.services.google) return true;
});

Accounts.validateLoginAttempt(function(user){
  return true;
});
