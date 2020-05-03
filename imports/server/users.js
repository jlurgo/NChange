
Meteor.publish('own_user', () => {
  return Meteor.users.find({_id: Meteor.userId()});
});

Meteor.publish('nchangers_list', (filter) => {
  console.warn('publishing users filtered by:' , filter);
  return Meteor.users.find(
    filter,
    {
      fields: {
        'services.google.name': 1,
        'services.google.picture': 1
      },
      limit: 100
    });
});
