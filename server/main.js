import { Meteor } from 'meteor/meteor';
import '../imports/shared/collections.js';
import '../imports/server/items.js';
import '../imports/server/nchanges.js';
import '../imports/server/tags.js';
import '../imports/server/users.js';
// import { createBasicData } from '../imports/server/createBasicData.js';
import BusinessRules from '../imports/server/BusinessRules.js';
import Migrations from '../imports/server/Migrations.js';

Meteor.startup(() => {
  //if(!Meteor.isAppTest) createBasicData();
  Migrations.run();
  BusinessRules.startAll();
});

Accounts.validateNewUser(function(user){
  return true;
  //if(!user.services.google) return true;
});

Accounts.validateLoginAttempt(function(user){
  return true;
});
