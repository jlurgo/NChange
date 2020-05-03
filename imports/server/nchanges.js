import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NChanges, Items } from '../shared/collections';
import { _ } from 'meteor/underscore';

// Only publish nchanges where the user is taking part
Meteor.publish('user_n_changes', () => {
  const usr = Meteor.userId();
  return NChanges.find({'nChangers': usr});
});

Meteor.publish('nchange_detail', (nchange_id) => {
  const usr = Meteor.userId();
  return NChanges.find({_id: nchange_id});
});

Meteor.methods({
  'nchanges.takeItem'(nchange_id, nthing_id) {
    // Make sure the user is logged in before updating an nchange
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const item = Items.findOne({_id: nthing_id});
    return NChanges.update({_id: nchange_id}, { $push: {
      actions: { user: this.userId, action: 'take',
        nThing: item._id, from: item.owner
      }
    }});
  },
  'nchanges.releaseItem'(nchange_id, nthing_id) {
    // Make sure the user is logged in before updating an nchange
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user_id = Meteor.userId();
    const item = Items.findOne({_id: nthing_id});
    return NChanges.update({_id: nchange_id}, { $pull: {
      actions: { user: user_id, action: 'take',
        nThing: item._id, from: item.owner
      }
    }});
  },
  'nchanges.approve'(nchange_id) {
    // Make sure the user is logged in before updating an nchange
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.warn('approving nchange');
    NChanges.update({_id: nchange_id}, { $push: {
      actions: { user: this.userId, action: 'approve' }
    }});
    // check if all participants approved the nchange
    const nchange = NChanges.findOne({_id: nchange_id});
    const all_approved = _.all(nchange.nChangers, (nchanger) => {
      return !!_.findWhere(nchange.actions,
        { action: 'approve', user: nchanger});
    })
    if(all_approved) {
      NChanges.update({_id: nchange_id}, { $set: { approved: true }});
    }
  },
  'nchanges.dont_approve'(nchange_id) {
    // Make sure the user is logged in before updating an nchange
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.warn('not approving nchange');
    return NChanges.update({_id: nchange_id}, { $pull: {
      actions: { user: this.userId, action: 'approve' }
    }});
  },
});
