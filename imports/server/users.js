import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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
