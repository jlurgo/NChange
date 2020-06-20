import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NChanges, NThings } from '../shared/collections';
import NChange from "../shared/NChange"
import { _ } from 'meteor/underscore';
import { matchObjects, rejectUnloggedUsers } from './utils';
import { NChangesController } from './NChangesController';

// publications
// Only publish nchanges where the user is taking part
Meteor.publish('user_n_changes', () => {
  const usr = Meteor.userId();
  return NChanges.find(
    {nChangers: usr, $or: [{ draft: false },{ creator: usr }]},
    {sort: { lastUpdated: -1 } }
  );
});

Meteor.publish('nchange_detail', (nchange_id) => {
  const usr = Meteor.userId();
  return NChanges.find({_id: nchange_id});
});

// authorization check functions
const rejectUsersNotInNChange = (nchange_id) => {
  check(nchange_id, String);

  const nchange = NChanges.findOne({_id: nchange_id, nChangers: this.userId});
  if (!nchange) {
    throw new Meteor.Error('you-are-not-part-of-this-nchange');
  }
};

const rejectOperationOnFinishedNchange = (nchange_id) => {
  check(nchange_id, String);

  const nchange = NChanges.findOne({_id: nchange_id, approved: true });
  if (nchange) {
    throw new Meteor.Error('this-nchange-is-already-approved');
  }
};

const rejectIfUserDoesNotOwnTheThing = (nthing_id) => {
  check(nthing_id, String);

  const nthing = NThings.findOne(nthing_id);
  if (nthing.owner != Meteor.userId()) {
    throw new Meteor.Error('this-nthing-does-not-belong-to-the-user');
  }
};

const rejectUserNotCreator = (nchange_id) => {
  check(nchange_id, String);

  const nchange = NChanges.findOne({_id: nchange_id, creator: this.userId});
  if (!nchange) {
    throw new Meteor.Error('you-are-not-creator-of-this-nchange');
  }
};


// API
Meteor.methods({
  'nchanges.new'(invited_nchanger, initial_actions) {
    console.warn('creating new nChange');
    rejectUnloggedUsers();
    const nChangers = [ this.userId ]
    if(invited_nchanger) {
      nChangers.push(invited_nchanger);
    }
    let detail = [];
    if (initial_actions) {
      detail = initial_actions
    }
    return NChanges.insert({
      nChangers: nChangers,
      detail: detail,
      draft: true,
      approvals: [],
      activity: [
        {timestamp: new Date(), action: 'create', user: this.userId}
      ],
      creator: this.userId,
      createdAt: new Date(),
      lastUpdated: new Date(),
    });
  },
  'nchanges.send'(nchange_id) {
    console.warn('adding message to nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectUserNotCreator(nchange_id);

    NChanges.update({_id: nchange_id}, {
      $set: {
        draft: false,
        lastUpdated: new Date(),
      }
    });
  },
  'nchanges.takeItem'(nchange_id, nchanger_id, nthing_id, qty) {
    console.warn('taking item:', nthing_id, qty);
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    const nthing = NThings.findOne({_id: nthing_id});
    const nchange = new NChange(NChanges.findOne(nchange_id));

    if(qty<=0) {
      Meteor.call('nchanges.releaseItem', nchange._id, nchanger_id, nthing._id, nthing.owner);
      return;
    }
    // adds nChanger to nChange if it's not already there
    !_.contains(nchange.nChangers, nthing.owner) && 
      Meteor.call('nchanges.add_nchanger', nchange_id, nthing.owner);
    
    const action_query = {
      nThing: nthing_id, user: nchanger_id, action: 'take', from: nthing.owner
    };
    let current_take_action = _.findWhere(nchange.detail, action_query);
    if (current_take_action) {
      NChanges.update({_id: nchange_id, detail: current_take_action },
        { $set: { "detail.$.qty" : qty }});
    } else {
      current_take_action = _.extend({qty: qty }, action_query);
      NChanges.update({_id: nchange_id }, {
        $push: {detail: current_take_action }});
    }
    const last_message = _.last(nchange.activity);
    if(matchObjects(last_message, action_query)) {
      // last message was a take from this user, just update qty and date
      NChanges.update({_id: nchange_id, activity: last_message },
        { $set: {
          "activity.$.qty" : qty,
          "activity.$.timestamp" : new Date()
        }});
    } else {
      const message = _.extend({timestamp: new Date()}, current_take_action);
      NChanges.update({_id: nchange_id }, {
        $push: { activity: message }});
    }
    NChangesController.retractAllApprovalsFromNchange(nchange_id);
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
  'nchanges.releaseItem'(nchange_id, nchanger_id, nthing_id) {
    console.warn('releasing item');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    const item = NThings.findOne({_id: nthing_id});
    NChanges.update({_id: nchange_id}, {
      $pull: { detail: {
        user: nchanger_id, action: 'take',
        nThing: item._id, from: item.owner}},
    });
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: nchanger_id, action: 'release',
        nThing: item._id, from: item.owner}}
    });
    NChangesController.retractAllApprovalsFromNchange(nchange_id);
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
  'nchanges.retrieveItem'(nchange_id, nchanger_id, nthing_id, taker_id) {
    console.warn('retrieving item');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    const item = NThings.findOne({_id: nthing_id});
    NChanges.update({_id: nchange_id}, {
      $pull: { detail: {
        user: taker_id, action: 'take',
        nThing: nthing_id, from: nchanger_id}},
    });
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: nchanger_id, action: 'retrieve',
        nThing: item._id, from: taker_id}}
    });
    NChangesController.retractAllApprovalsFromNchange(nchange_id);
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
  'nchanges.approve'(nchange_id) {
    console.warn('approving nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    // check if user is taking AND giving something
    let nchange = NChanges.findOne({_id: nchange_id});
    const user_input_items = _.where(nchange.detail,
      { action: 'take', user: this.userId});

    const user_output_items = _.where(nchange.detail,
      { action: 'take', from: this.userId});

    const user_gives_and_receives =
      user_input_items.length > 0 && user_output_items.length > 0

    if (!user_gives_and_receives) {
      console.warn('user cant approve if he doesnt give and receive');
      throw new Meteor.Error('user-cant-approve-if-he-doesnt-give-and-receive');
    }

    NChanges.update({_id: nchange_id}, { $push: {
      approvals: this.userId
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'approve',
      }}
    });
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
    // check if all participants approved the nchange
    // getting the nchange again to get latest
    nchange = NChanges.findOne({_id: nchange_id});
    const all_approved =
      _.difference(nchange.nChangers, nchange.approvals).length == 0;
    if(!all_approved) return;
    console.warn('all nchangers approved this nchange!');
    // approving the nChange
    NChanges.update({_id: nchange_id}, { $set: { approved: true }});
    console.warn('nchange approved!');

    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), action: 'finish',
      }}
    });

    console.warn('changing ownership of nchanged things');
    // update ownership of taken things
    nchange.nChangers.forEach((nchanger) => {
      const take_actions = _.where(nchange.detail, {
        user: nchanger, action: 'take'
      });
      take_actions.forEach((action)=>{
        const nthing = NThings.findOne({_id: action.nThing },
          {fields: {_id: 0 }});
        console.warn('transfering thing: ', nthing, action);
        if(nthing.stock == action.qty ) {
          NThings.update({_id: action.nThing }, {$set: {
            owner: nchanger
          }});
        } else {
          const new_nthing = _.extend({}, nthing, {
            owner: nchanger,
            guardian: nthing.guardian,
            stock: action.qty,
            createdAt: new Date(),
          });
          NThings.insert(new_nthing);
          NThings.update({_id: action.nThing },
            {$set: {stock: nthing.stock - action.qty}});
        }
      });
    })
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
  'nchanges.dont_approve'(nchange_id) {
    console.warn('not approving nchange');
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    NChanges.update({_id: nchange_id}, { $pull: {
      approvals: this.userId
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'unapprove',
      }}
    });
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
  'nchanges.add_nchanger'(nchange_id, nchanger_id) {
    console.warn('adding nchanger to nchange', nchanger_id);
    rejectUnloggedUsers();
    rejectUsersNotInNChange(nchange_id);
    rejectOperationOnFinishedNchange(nchange_id);

    NChanges.update({_id: nchange_id}, { $push: {
      nChangers: nchanger_id
    }});
    NChanges.update({_id: nchange_id}, {
      $push: { activity: {
        timestamp: new Date(), user: this.userId, action: 'addnchanger',
        addedNchanger: nchanger_id,
      }}
    });
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
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
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
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
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  },
});
