import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

const default_values = {
  tags: [],
  pics: [],
  thumbnail: '',
  stock: 1,
  longDescription: '',
};

export default class NThing {
  constructor (nthing) {
    _.extend(this, default_values, {
        owner: Meteor.userId(),
        guardian: Meteor.userId()
      }, nthing);
  }

  archive = (cb) => {
    console.warn('archiving:', this);
    this.canBeUpdatedByMe() && Meteor.call('nthings.archive', this._id, cb);
  }

  canBeUpdatedByMe = () => {
    const user = Meteor.userId();
    return (this.owner == user) && (this.guardian == user)
  }

  save = (cb) => {
    console.warn('saving:', this);

    if (!this._id) {
      Meteor.call('nthings.new', this, cb );
      return;
    }
    Meteor.call('nthings.update', this, cb );
  }
}
