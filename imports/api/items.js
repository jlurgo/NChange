import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Items = new Mongo.Collection('items');

const item_for_list_projection = {
  shortDescription: 1,
  pics: { $slice: 1 }, // return only first picture
  tags: 1
}

if (Meteor.isServer) {
  // returns limited data from items to show on filtered lists
  Meteor.publish('filtered_items_summary', (filter, limit) => {
    console.warn(`subscribing to items summary with filter: ${JSON.stringify(filter)} and limit: ${limit}`);
    return Items.find(filter, {
      fields: item_for_list_projection,
      limit: limit
    });
  });
}

Meteor.methods({
  'items.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a item
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Items.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'items.remove'(itemId) {
    check(itemId, String);

    const item = Items.findOne(itemId);
    if (item.private && item.owner !== this.userId) {
      // If the item is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Items.remove(itemId);
  },
  'items.setPrivate'(itemId, setToPrivate) {
    check(itemId, String);
    check(setToPrivate, Boolean);

    const item = Items.findOne(itemId);

    // Make sure only the item owner can make a item private
    if (item.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Items.update(itemId, { $set: { private: setToPrivate } });
  },
});
