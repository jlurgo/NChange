import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';

// returns limited data from items to show on filtered lists
Meteor.publish('filtered_items_summary', (filter, limit) => {
  const item_for_list_projection = {
    shortDescription: 1,
    pics: { $slice: 1 }, // return only first picture
    tags: 1,
    owner: 1,
    likedBy: 1, // TODO: only return user like {$elemMatch: {userId : this.userId}}
  };
  console.warn(`subscribing to items summary with filter: ${JSON.stringify(filter)} and limit: ${limit}`);
  return Items.find(filter, {
    fields: item_for_list_projection,
    limit: limit
  });
});

Meteor.publish('nthing_detail', (id) => {
  console.warn(`subscribing to nthing_detail with id: ${id}`);
  return Items.find({
    _id: id
  });
});

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
  'items.like'(itemId) {
    check(itemId, String);
    console.warn(`liking item with id: ${itemId}`);
    const item = Items.findOne(itemId);
    // Make sure only the item owner can make a item private
    if (item.owner == this.userId) {
      throw new Meteor.Error('you cannot like your own items');
    }
    Items.update(itemId, { $push: { likedBy: {userId: this.userId}} });
  },
  'items.unlike'(itemId) {
    check(itemId, String);
    console.warn(`unliking item with id: ${itemId}`);
    const item = Items.findOne(itemId);
    // Make sure only the item owner can make a item private
    if (item.owner == this.userId) {
      throw new Meteor.Error('you cannot unlike your own items');
    }
    Items.update(itemId, { $pull: { likedBy: {userId: this.userId}}});
  },
});
