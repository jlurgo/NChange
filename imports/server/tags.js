import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { NThings } from "../shared/collections";
import { _ } from 'meteor/underscore';

Meteor.publish('tags', function(filter){
  console.warn('subscribing to tags');
  NThings._collection.rawCollection().distinct('tags', filter).then((tags)=>{
    tags.forEach((tag)=>{
      this.added('tags', tag, {});
    });
  });
  this.ready();
});
