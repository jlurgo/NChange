import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

export default class NChange {
  constructor (nchange) {
    this._nchange = nchange;
    _.extend(this, nchange);
  }

  getRemainingThingStock = (nthing, nchanger_to_exclude) => {
    const remaining_stock = _.chain(this.detail)
      .where({action: 'take', nThing: nthing._id})
      .filter((a) => { return a.user !== nchanger_to_exclude})
      .reduce((memo_stock, action) => {
        return (memo_stock - (action.qty || 1));
      }, nthing.stock === undefined ? 1 : nthing.stock)
      .value();
    return remaining_stock;
  }

  approvedBy = (nchanger_id) => {
    return _.contains(this.approvals, nchanger_id);
  }

  thingQtyTakenBy = (nthing_id, nchanger_id) => {
    const current_take_action = _.findWhere(this.detail, {
      nThing: nthing_id, user: nchanger_id, action: 'take'
    });
    if (!current_take_action) return 0;
    if (isNaN(current_take_action.qty)) return 1;
    return current_take_action.qty
  }

  getNchangerInputThings = (nchanger_id) => {
    return _.where(this.detail, { action: 'take', user: nchanger_id});
  }

  getNchangerOutputThings = (nchanger_id) => {
    return _.where(this.detail, { action: 'take', from: nchanger_id});
  }

  nChangerGivesAndReceives = (nchanger_id) => {
    return this.getNchangerInputThings(nchanger_id).length > 0 &&
      this.getNchangerOutputThings(nchanger_id).length > 0
  }

  nchangerCanApprove = (nchanger_id) => {
    return this.nChangerGivesAndReceives(nchanger_id);
  }

  getOtherNchangersId = (nchanger_id) => {
    return _.without(this.nChangers, nchanger_id);
  }
}
