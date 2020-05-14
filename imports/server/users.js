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
        'services.google.name': 1,
        'services.google.picture': 1
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
        firstName: 1,
        lastName: 1,
        'services.google.name': 1,
        'services.google.picture': 1
      }
    });
});
