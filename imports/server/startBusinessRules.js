import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';
import { NChangesController } from './NChangesController';
import { UsersController } from './UsersController';

export const startBusinessRules = () => {
  // observers
  // if an item is archived must be removed from all ongoing nchanges
  console.warn('ensuring that when an item is archived will be removed from ongoing nchanges ');
  Items.find({
    archived: true
  }, {
    fields: { archived: 1}
  }).observeChanges(
      {
        added(thing_id) {
          console.warn(`thing with id: ${thing_id} was archived`);
          NChangesController.removeThingFromAllCurrentNchanges(thing_id)
        }
      }
  );

  // if an item is archived must be removed from all ongoing nchanges
  console.warn('ensuring that when an item owners change, it will be removed from previous nchanges ');
  Items.find({
  }, {
    fields: { owner: 1 }
  }).observe(
      {
        changed(old_thing, new_thing) {
          console.warn(`thing: ${old_thing._id} changed
            owner from ${old_thing.owner} to ${new_thing.owner}`);
          NChangesController.removeThingFromAllCurrentNchanges(old_thing._id)
        }
      }
  );

  console.warn('ensuring that when an item stock change, it will be removed from previous nchanges ');
  Items.find({
  }, {
    fields: { stock: 1 }
  }).observe(
      {
        changed(old_thing, new_thing) {
          console.warn(`thing: ${old_thing._id} changed
            stock from ${old_thing.stock} to ${new_thing.stock}`);
          NChangesController.removeThingFromAllCurrentNchanges(old_thing._id)
        }
      }
  );

  // when a google user is inserted his personal data will be moved to the user root doc
  console.warn('when a google user is inserted personal data will be added to user doc');
  Meteor.users.find({
    userName: { $exists: false },
    fullName: { $exists: false },
    pic: { $exists: false },
    'services.google': { $exists: true }
  }).observe(
      {
        added(user) {
          console.warn(`completing data for google user ${user._id}`)
          const g_service = user.services.google;
          const first_name = g_service.given_name;
          const last_name = g_service.family_name;
          user.fullName = g_service.name;
          user.userName = UsersController.getUserNameFromNames(first_name, last_name);
          user.pic = g_service.picture;
          Meteor.users.update({_id: user._id}, {$set: user});
        }
      }
  );
}
