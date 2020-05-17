import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';
import { NChangesController } from './NChangesController';

// returns limited data from items to show on filtered lists
Meteor.publish('filtered_items_summary', (filter, limit) => {
  const item_for_list_projection = {
    pics: { $slice: 1 }, // return only first picture
    tags: 1,
    stock: 1,
    owner: 1,
    likedBy: 1, // TODO: only return user like {$elemMatch: {userId : this.userId}}
  };
  console.warn(`subscribing to items summary with filter: ${JSON.stringify(filter)} and limit: ${limit}`);
  filter.archived = {
    $exists: false
  }
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
  'nthings.new'(nthing) {
    console.warn('creating a thing');
    // Make sure the user is logged in before inserting a item
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (nthing._id) {
      throw new Meteor.Error('cant-create-nthing-providing_id');
    }

    nthing.owner = this.userId;
    nthing.createdAt = new Date();
    nthing.tags = nthing.tags || [];
    nthing.pics = nthing.pics || [];

    return Items.insert(nthing);
  },
  'nthings.update'(n_thing) {
    console.warn('updating a thing');
    // Make sure the user is logged and owns the thing
    if (!this.userId || n_thing.owner != this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    n_thing.updatedAt = new Date();

    Items.update(n_thing._id, n_thing);
  },
  'nthings.archive'(itemId) {
    check(itemId, String);
    console.warn('archiving a thing');

    const item = Items.findOne(itemId);
    if (item.owner !== this.userId) {
      // make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Items.update(itemId, { $set: {
      archived: true
    }});
  },
  'nthings.setPrivate'(itemId, setToPrivate) {
    check(itemId, String);
    check(setToPrivate, Boolean);

    const item = Items.findOne(itemId);

    // Make sure only the item owner can make a item private
    if (item.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Items.update(itemId, { $set: { private: setToPrivate } });
  },
  'nthings.like'(itemId) {
    check(itemId, String);
    console.warn(`liking item with id: ${itemId}`);
    const item = Items.findOne(itemId);
    if (item.owner == this.userId) {
      throw new Meteor.Error('you cannot like your own items');
    }
    Items.update(itemId, { $push: { likedBy: {userId: this.userId}} });
  },
  'nthings.unlike'(itemId) {
    check(itemId, String);
    console.warn(`unliking item with id: ${itemId}`);
    const item = Items.findOne(itemId);
    if (item.owner == this.userId) {
      throw new Meteor.Error('you cannot unlike your own items');
    }
    Items.update(itemId, { $pull: { likedBy: {userId: this.userId}}});
  },
});
