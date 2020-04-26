import React from 'react';
import utils from './utils';
import OAuthButton from './OAuthButton.jsx';
import PasswordForm from './PasswordForm.jsx';

const styles = {
  title: {
    textAlign: 'center'
  }
}

export default class LoginForm extends React.Component {
  render() {
    const services = utils.getServiceNames();
    return (
      <div>
        {utils.hasPasswordService() &&
          <PasswordForm
            type='login'
            onError={this.props.onError}
            clearErrors={this.props.clearErrors}
          />
        }
        {(utils.hasPasswordService() && services.length > 0) &&
          (<h3 style={styles.title}> OR </h3>)
        }
        <div>
          {services.map(service => (
            <OAuthButton
              service={service}
              text={`Log in with google`}
              key={service}
            />
            ))}
        </div>
      </div>
    );
  };
};
