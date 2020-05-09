import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NChanges, Items } from '../shared/collections';
import { _ } from 'meteor/underscore';
import { rejectUnloggedUsers } from './utils';

// Only publish nchanges where the user is taking part
Meteor.publish('user_n_changes', () => {
  const usr = Meteor.userId();
  return NChanges.find({'nChangers': usr});
});

Meteor.publish('nchange_detail', (nchange_id) => {
  const usr = Meteor.userId();
  return NChanges.find({_id: nchange_id});
});

const rejectUsersNotInNChange = (nchange_id) => {
  check(nchange_id, String);

  nchange = NChanges.findOne({_id: nchange_id, nChangers: this.userId});
  if (!nchange) {
    throw new Meteor.Error('you-are-not-part-of-this-nchange');
  }
};

const rejectOperationOnFinishedNchange = (nchange_id) => {
  check(nchange_id, String);

  nchange = NChanges.findOne({_id: nchange_id, approved: true });
  if (nchange) {
    throw new Meteor.Error('this-nchange-is-already-approved');
  }
};

Meteor.methods({
  'nchanges.new'() {
    console.warn('creating new nChange');
    rejectUnloggedUsers();

    return NChanges.insert({
      nChangers: [ this.userId ],
      detail: [ ],
      activity: [
        {timestamp: new Date(), action: 'create', user: this.userId}
      ],
      createdAt: new Date(),
    });
  },
  'nchanges.takeItem'(nchange_id, nthing_id) {
    console.warn('taking item');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    const item = Items.findOne({_id: nthing_id});
    NChanges.update({_id: nchange_id}, {
      $push: { detail: {
        user: this.userId, action: 'take',
        nThing: item._id, from: item.owner}}
    });
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'take',
        nThing: item._id, from: item.owner}}
    });
    // we retract approvals because conditions changed
    const nchange = NChanges.findOne({_id: nchange_id});
    // TODO: only retract approvals affected by this change
    NChanges.update({_id: nchange_id}, { $pull: {
      detail: { action: 'approve' }
    }});
  },
  'nchanges.releaseItem'(nchange_id, nthing_id) {
    console.warn('releasing item');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    const user_id = Meteor.userId();
    const item = Items.findOne({_id: nthing_id});
    NChanges.update({_id: nchange_id}, {
      $pull: { detail: {
        user: user_id, action: 'take',
        nThing: item._id, from: item.owner}},
    });
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'release',
        nThing: item._id, from: item.owner}}
    });
    // we retract approvals because conditions changed
    const nchange = NChanges.findOne({_id: nchange_id});
    // TODO: only retract approvals affected by this change
    NChanges.update({_id: nchange_id}, { $pull: {
      detail: { action: 'approve' }
    }});
  },
  'nchanges.approve'(nchange_id) {
    console.warn('approving nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    NChanges.update({_id: nchange_id}, { $push: {
      detail: { user: this.userId, action: 'approve' }
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'approve',
      }}
    });
    // check if all participants approved the nchange
    const nchange = NChanges.findOne({_id: nchange_id});
    const all_approved = _.all(nchange.nChangers, (nchanger) => {
      return !!_.findWhere(nchange.detail,
        { action: 'approve', user: nchanger});
    })

    if(!all_approved) return;
    // approving the nChange
    NChanges.update({_id: nchange_id}, { $set: { approved: true }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), action: 'finish',
      }}
    });
    // update ownership of taken things
    nchange.nChangers.forEach((nchanger) => {
      console.warn('taking items for:', nchanger);
      const take_actions = _.where(nchange.detail, {
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
    console.warn('not approving nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    NChanges.update({_id: nchange_id}, { $pull: {
      detail: { user: this.userId, action: 'approve' }
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'unapprove',
      }}
    });
  },
  'nchanges.add_nchanger'(nchange_id, nchanger_mail) {
    console.warn('adding nchanger to nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    console.warn('user mail:', nchanger_mail);
    const user = Meteor.users.findOne({'services.google.email': nchanger_mail});
    if (!user) throw new Meteor.Error('nchanger-not-found');
    console.warn('user:', user);
    NChanges.update({_id: nchange_id}, { $push: {
      nChangers: user._id
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'addnchanger',
        addedNchanger: user._id,
      }}
    });
  },
  'nchanges.new_chat_message'(nchange_id, message) {
    console.warn('adding message to nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);

    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'chatmessage',
        message: message
      }}
    });
  },
  'nchanges.leave'(nchange_id) {
    console.warn('leaving nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);

    NChanges.update({_id: nchange_id}, { $pull: {
      nChangers: this.userId
    }});

    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'leave'
      }}
    });
    // we retract approvals and releaseeverything given and taken
    const nchange = NChanges.findOne({_id: nchange_id});
    // TODO: only retract approvals affected by this change

    // remove all actions involving the user
    NChanges.update({_id: nchange_id}, { $pull: {
      detail: { user: this.userId }
    }});
    NChanges.update({_id: nchange_id}, { $pull: {
      detail: { from: this.userId }
    }});
  },
});
