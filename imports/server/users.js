
Meteor.publish('own_user', () => {
  return Meteor.users.find({_id: Meteor.userId()});
});
