export const rejectUnloggedUsers = () => {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
}

export const matchObjects = (obj, matcher) => {
  return Object.keys(matcher).every(function (key) {
    return obj[key] === matcher[key];
  });
};
