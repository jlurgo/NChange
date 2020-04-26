import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorMessages from './ErrorMessages.jsx';
import { Redirect } from 'react-router';

const styles = {
  title: {
    textAlign: 'center'
  },
  input: {
    width: '97%',
    paddingLeft: '1rem',
    height: '2rem',
    borderRadius: '5px',
    border: 'none',
  },
  button: {
    width: '100%',
    height: '3rem',
    borderRadius: '5px',
    border: 'none',
    marginTop: '1rem',
    background: '#00a1d8',
    color: 'white',
  },
  label: {
    display: 'block',
    marginTop: '1.5rem',
    marginBottom: '0.3rem',
    fontWeight: 500,
  },
  link: {
    color: '#00A0DB',
    textDecoration: 'none',
  }
}

class ResetPasswordBox extends React.Component {

  state = {
    loading: false,
    error: null,
    emailSent: false,
    email: '',
  }

  renderErrorMessages = () => {
    if (this.state.error) {
      return <ErrorMessages errors={[this.state.error]} />;
    }
    return <div />;
  }

  handleChange = (e) => {
    const newState = {};
    newState[e.target.name] = e.target.value;

    this.setState(newState);
  }

  sendLink = () => {
    const { email } = this.state;

    if (!email) {
      this.setState({ error: 'you need to provide email' });
      return;
    }

    this.setState({
      loading: true,
      error: null,
    });

    Accounts.forgotPassword({ email }, (err) => {
      if (err) {
        this.setState({
          error: err.reason || err.message,
          loading: false,
        });
        return;
      }

      this.setState({
        error: null,
        loading: false,
        emailSent: true,
      });
    });
  }

  render() {
    if (this.props.user) {
      return <Redirect to='/' />;
    }

    if (this.state.emailSent) {
      return (
        <div>
          <h2> email sent</h2>
            Check your inbox for further instructions
          </div>
      );
    }

    return (
      <div>
        <div>
          <h2 style={styles.title}> reset password </h2>
          <form
            onSubmit={this.handleSubmit}
          >
            <div>
              <label htmlFor='email' style={styles.label}>Email</label>
              <div>
                <input
                  type='email'
                  placeholder='email'
                  name='email'
                  required
                  onChange={this.handleChange}
                  value={this.state.email}
                  style={styles.input}
                />
              </div>
            </div>

            <input
              type='button'
              value='send reset link'
              style={styles.button}
              onClick={this.sendLink}
            />
          </form>
        </div>

        { this.renderErrorMessages() }
      </div>
    );
  }
}

export default withTracker(() => ({
  user: Meteor.users.findOne(),
}))(ResetPasswordBox);
