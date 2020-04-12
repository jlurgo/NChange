import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorMessages from './ErrorMessages.jsx';
import LoginForm from './LoginForm.jsx';
import utils from './utils';
import { Redirect } from 'react-router';
import PasswordForm from './PasswordForm.jsx';

const styles = {
    title: {
      textAlign: 'center'
    }
}

export default class RegisterBox extends React.Component {

  state = {
    errors: [],
  }

  renderErrorMessages = () => {
    if (this.state.errors.length > 0) {
      return <ErrorMessages errors={this.state.errors} />;
    }
    return <div />;
  }

  render() {
    if (this.props.user) {
      return <Redirect to='/'/>;
    }

    return (
      <div>
        <div>
          <h3 style={styles.title}> Register </h3>
          <PasswordForm
            type='register'
            onError={utils.onError.bind(this)}
            clearErrors={utils.clearErrors.bind(this)}
          />
        </div>

        {this.renderErrorMessages()}
    </div>
  );
  }
}
