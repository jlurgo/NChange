import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NChanges, NThings } from '../shared/collections';
import { _ } from 'meteor/underscore';

export const NChangesController = {
  removeThingFromAllCurrentNchanges(thing_id) {
    check(thing_id, String);

    console.warn(`removing thing ${thing_id} from all current nchanges using it`);
    // remove actions involving the thing
    const nchanges_using_thing = NChanges.find({
      approved: { $exists: false },
      detail: { $elemMatch: { nThing: thing_id }}
    }).map((nch) => {return nch._id});

    console.warn(`thing ${thing_id} is used in this nchanges: ${nchanges_using_thing}`);
    NChanges.update({_id: { $in: nchanges_using_thing}}, { $pull: {
      detail: { nThing: thing_id, action: 'take' }
    }}, { multi: true });

    NChanges.update({_id: { $in: nchanges_using_thing}}, {
      $push: { activity: {
        timestamp: new Date(), action: 'remove', nThing: thing_id
      }}
    }, { multi: true });

    nchanges_using_thing.forEach((nchange_id) => {
      this.retractAllApprovalsFromNchange(nchange_id);
      NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
    });
  },
  retractAllApprovalsFromNchange(nchange_id) {
    console.warn('retracting all approvals from nchange: ', nchange_id);
    const nchange = NChanges.findOne(nchange_id);
    nchange.approvals.forEach((nchanger_id)=> {
      NChanges.update({_id: nchange_id}, {
        $push: { activity: {
          timestamp: new Date(), user: nchanger_id, action: 'unapprove',
        }}
      });
    });
    NChanges.update({_id: nchange_id}, { $set: {
      approvals: []
    }});
    NChanges.update({_id: nchange_id }, {$set: { lastUpdated: new Date() }});
  }
}
