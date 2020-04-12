export default {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  getServiceNames() {
    if (!Package['accounts-oauth']) {
      // no oauth package so no services
      return [];
    }
    return Accounts.oauth.serviceNames().sort();
  },
  hasPasswordService() {
    return !!Package['accounts-password'];
  },
  performOAuthLogin(service, cb) {
    try {
      Meteor[`loginWith${this.capitalize(service)}`]({}, cb);
    } catch (e) {
      cb(e);
    }
  },
  onError(error) {
    const errors = [];
    errors.push(error);
    this.setState({ errors });
  },
  clearErrors() {
    this.setState({ errors: [] });
  },
};
