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
  'nchanges.new'() {
    console.warn('creating new nChange');
    // Make sure the user is logged in before inserting a item
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return NChanges.insert({
      nChangers: [ this.userId ],
      actions: [
      ],
      createdAt: new Date(),
    });
  },
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
    if(!all_approved) return;
    // approving the nChange
    NChanges.update({_id: nchange_id}, { $set: { approved: true }});

    // update ownership of taken things
    nchange.nChangers.forEach((nchanger) => {
      console.warn('taking items for:', nchanger);
      const take_actions = _.where(nchange.actions, {
        user: nchanger, action: 'take'
      });
      console.warn('taking actions:', take_actions);
      const taken_items = _.map(take_actions, (action) => {
        return action.nThing;
      });
      console.warn('taken items:', taken_items);

      Items.update({_id: { $in: taken_items }}, {$set: { owner: nchanger}},
        {multi: true});
    })
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
  'nchanges.add_nchanger'(nchange_id, nchanger_mail) {
    console.warn('adding nchanger to nchange');
    // Make sure the user is logged in before updating an nchange
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.warn('user mail:', nchanger_mail);
    const user = Meteor.users.findOne({'services.google.email': nchanger_mail});
    if (!user) throw new Meteor.Error('nchanger-not-found');
    console.warn('user:', user);
    return NChanges.update({_id: nchange_id}, { $push: {
      nChangers: user._id
    }});
  },
});
