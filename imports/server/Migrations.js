import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from '../shared/collections';
import { NChangesController } from './NChangesController';
import { UsersController } from './UsersController';

export default Migrations = {
  run() {
    // nthings should have stock
    Items.update({ stock: { $exists: false }}, {$set: { stock: 1 }}, { multi: true });
    // nthings should have a guardian
    Items.find({ guardian: { $exists: false }}).forEach((nthing) => {
      Items.update({ _id: nthing._id }, {$set: { guardian: nthing.owner }});
    });
  }
};
