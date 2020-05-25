import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { UsersController } from './UsersController';

Meteor.publish('own_user', () => {
  return Meteor.users.find({_id: Meteor.userId()});
});

Meteor.publish('nchangers_list', (filter) => {
  console.warn('publishing users filtered by:' , filter);
  return Meteor.users.find(
    filter,
    {
      fields: {
        userName: 1,
        fullName: 1,
        pic: 1
      },
      limit: 100
    });
});

Meteor.publish('nchanger_detail', (nchanger_id) => {
  console.warn('publishing user:' , nchanger_id);
  check(nchanger_id, String);
  return Meteor.users.find(
    {_id: nchanger_id},
    {
      fields: {
        fullName: 1,
        userName: 1,
        pic: 1
      }
    });
});

Meteor.methods({
  'users.setUserName'(new_user_name) {
    console.warn('updating own username ', new_user_name, this.userId);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if (UsersController.usernameExists(new_user_name)) {
      throw new Meteor.Error('username-already-taken');
    }

    return Meteor.users.update({_id: this.userId }, {$set: { userName: new_user_name}});
  },
  'users.setFullName'(new_full_name) {
    console.warn('updating own full name ', new_full_name, this.userId);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Meteor.users.update({_id: this.userId }, {$set: { fullName: new_full_name}});
  },
  'users.setPic'(new_url) {
    console.warn('updating own pic ', new_url, this.userId);
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Meteor.users.update({_id: this.userId }, {$set: { pic: new_url}});
  }
});
