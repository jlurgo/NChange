import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NThings } from '../shared/collections';
import { NChangesController } from './NChangesController';
import { UsersController } from './UsersController';

export default Migrations = {
  run() {
    // nthings should have stock
    NThings.update({ stock: { $exists: false }}, {$set: { stock: 1 }}, { multi: true });
    // nthings should have a guardian
    NThings.find({ guardian: { $exists: false }}).forEach((nthing) => {
      NThings.update({ _id: nthing._id }, {$set: { guardian: nthing.owner }});
    });
    // nThings should have a thumbnail
    NThings.find({ thumbnail: { $exists: false }}).forEach((nthing) => {
      if (!nthing.pics) return;
      NThings.update({ _id: nthing._id }, {$set: { thumbnail: nthing.pics[0] }});
    });
  }
};
