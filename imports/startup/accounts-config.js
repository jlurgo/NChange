import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.onConnection(function(result){
    var hostname = result.httpHeaders.referer; //This returns http://foo.example.com
    Meteor.loginWithGoogle({
      "redirectUrl":hostname + "/_oauth/google?close"
    });
  });
}
