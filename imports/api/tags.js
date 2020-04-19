import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Items } from "./items.js";
import { _ } from 'meteor/underscore';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tags', function(filter){
    console.warn('subscribing to tags');
    Items._collection.rawCollection().distinct('tags', filter).then((tags)=>{
      tags.forEach((tag)=>{
        this.added('tags', tag, {});
      });
    });
    this.ready();
  });
}
