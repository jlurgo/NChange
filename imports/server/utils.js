export const rejectUnloggedUsers = () => {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
}
