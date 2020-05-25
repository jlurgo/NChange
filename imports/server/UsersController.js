import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

export const UsersController = {
  getUserNameFromNames(first_name, last_name, suffix) {
    let user_name = first_name.charAt(first_name) + last_name + (suffix || '');
    if(!this.usernameExists(user_name)) return user_name;
    return this.getUserNameFromNames(first_name, last_name, suffix ? suffix + 1 : 1 );
  },
  usernameExists(user_name) {
    return !!Meteor.users.findOne({ userName: {
      $regex : "^" + user_name.toLowerCase() + "\\b",
      $options: "i"
    }});
  }
}
