import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';
import { NChangesController } from './NChangesController';

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
  console.warn('ensuring that when an item owner change will be removed from previous nchanges ');
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
}
