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
  runningOnMobile() {
    const toMatch = [
        'Android',
        'webOS',
        'iPhone',
        'ipad',
        'iPod',
        'BlackBerry',
        'Windows Phone'
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.includes(toMatchItem);
    });
  },
  performOAuthLogin(service, cb) {
    const loginStyle = this.runningOnMobile() ? 'redirect' : 'popup';
    try {
      Meteor[`loginWith${this.capitalize(service)}`]({loginStyle: loginStyle}, cb);
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
