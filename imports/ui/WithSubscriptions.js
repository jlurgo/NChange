import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingPane from './LoadingPane';

export function withSubscriptions(subscriptions_data, props_getter, Component) {
  return class extends React.PureComponent {

    state = {
      subsReady: false
    }

    componentDidMount() {
      console.warn('mounting');
      this.subs = _.map(subscriptions_data, (sub_data) => {

        if(_.isFunction(sub_data)) {
          console.warn(`starting custom subscription with function ${sub_data && sub_data.name}`);
          return sub_data(this.props);
        }
        console.warn(`subscribing to ${sub_data}`);
        return Meteor.subscribe(sub_data)
      });
      this.tracker = Tracker.autorun(() => {
        console.warn('checking readiness: ', _.all(this.subs, sub => sub.ready()));
        this.setState({
          subsReady: _.all(this.subs, sub => sub.ready())
        });
      });
    }

    componentWillUnmount() {
      _.forEach(this.subs, (sub) => {
        sub.stop();
      });
      this.tracker.stop();
    }

    render() {
      console.warn('rendering');
      if (!this.state.subsReady) {
        return (<LoadingPane/>);
      }
      const WrappedComponent = withTracker(props_getter)(Component);
      return (<WrappedComponent {...this.props}/>);
    }
  };
}
