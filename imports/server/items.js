import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';
import NThing from '../shared/NThing';

import { NChangesController } from './NChangesController';

// returns limited data from items to show on filtered lists
Meteor.publish('filtered_items_summary', (filter, limit) => {
  const item_for_list_projection = {
    thumbnail: 1,
    tags: 1,
    stock: 1,
    owner: 1,
    guardian: 1,
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
    if (nthing.stock < 1) {
      throw new Meteor.Error('cant-create-nthing-without-stock');
    }
    nthing = new NThing(nthing);
    nthing.createdAt = new Date();

    return Items.insert(nthing);
  },
  'nthings.update'(nthing) {
    console.warn('updating a thing');
    nthing = new NThing(nthing);
    // Make sure the user is logged and owns the thing
    // if (!nthing.canBeUpdatedByMe(this.userId)) {
    //   throw new Meteor.Error('not-authorized');
    // }

    nthing.updatedAt = new Date();

    Items.update(nthing._id, { $set: _.pick(nthing,
      'tags', 'pics', 'thumbnail', 'stock', 'longDescription', 'updatedAt')
    });
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
  'nthings.markAsReceived'(nthing_id) {
    check(nthing_id, String);
    console.warn('marking a thing as received:', nthing_id);

    const nthing = Items.findOne(nthing_id);
    if (nthing.owner !== this.userId) {
      // make sure only the owner can receive it
      throw new Meteor.Error('not-authorized');
    }
    Items.update(nthing_id, { $set: {
      guardian: this.userId
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
