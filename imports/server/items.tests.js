/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Items } from '../shared/collections';

if (Meteor.isServer) {
  describe('Items', () => {
    describe('methods', () => {
      const userId = Random.id();
      let itemId;

      beforeEach(() => {
        Items.remove({});
        itemId = Items.insert({
          text: 'test item',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned item', () => {
        // Find the internal implementation of the item method so we can
        // test it in isolation
        // const deleteItem = Meteor.server.method_handlers['nthings.archive'];
        //
        // // Set up a fake method invocation that looks like what the method expects
        // const invocation = { userId };
        //
        // // Run the method with `this` set to the fake invocation
        // deleteItem.apply(invocation, [itemId]);

        Meteor.call('nthings.archive', { userId });
        // Verify that the method does what we expected
        assert.equal(Items.find().count(), 0);
      });
    });
  });
}
