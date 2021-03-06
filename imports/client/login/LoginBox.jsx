import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorMessages from './ErrorMessages.jsx';
import LoginForm from './LoginForm.jsx';
import utils from './utils';
import { Redirect } from 'react-router';
const styles = {
    title: {
      textAlign: 'center'
    }
}

class LoginBox extends React.Component {

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
    return (
      <div>
        <div>
          <LoginForm
            onError={utils.onError.bind(this)}
            clearErrors={utils.clearErrors.bind(this)}
          />
        </div>

        {this.renderErrorMessages()}
    </div>
  );
  }
}

export default withTracker(() => ({
  user: Meteor.users.findOne(),
}))(LoginBox);
