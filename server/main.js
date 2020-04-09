import { Meteor } from 'meteor/meteor';
import '../imports/api/items.js';

Meteor.startup(() => {
  // Client startup method.
 	  //Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://hand-raiser-evmipmlnls.now.sh/';
});

Accounts.validateNewUser(function(user){
  return true;
  //if(!user.services.google) return true;
  // if(user.services.google.email.match(/creativa77\.com\.ar$/)) {
  //     return true;
  // }
  // throw new Meteor.Error(403, "You must sign in using a creativa77.com.ar account");
});

Accounts.validateLoginAttempt(function(user){
  return true;
});
