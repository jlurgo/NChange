import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import utils from './utils';
import { Link } from 'react-router-dom';

const styles = {
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

class PasswordForm extends React.Component {

  state = {
    loading: false,
    email: '',
    password: '',
    password2: '',
  }

  handleChange = (e) => {
    const newState = {};
    newState[e.target.name] = e.target.value;

    this.setState(newState);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { clearErrors, onError, type } = this.props;
    const { password, email } = this.state;

    if (type === 'login') {
      // log in / sign in

      this.setState({ loading: true });
      Meteor.loginWithPassword(
        email,
        password,
        (err) => {
          // let errors = this.state.errors;
          this.setState({ loading: false });

          if (err && err.error === 400) {
            onError('invalid username or password');
          } else if (err) {
            onError(err.reason || 'unknown error');
          } else {
            clearErrors();
          }
        },
      );
    } else {
      // register / sign up
      const { password2 } = this.state;

      if (password !== password2) {
        onError(`passwords don't match`);

        return;
      }

      this.setState({ loading: true });

      Accounts.createUser({
        email,
        password,
      }, (err) => {
        this.setState({ loading: false });
        if (err) {
          onError(err.reason || 'unknown_error');
        } else {
          clearErrors();
        }
      });
    }
  }

  render() {
    if (!utils.hasPasswordService()) {
      return <div />;
    }

    return (
      <form
        onSubmit={this.handleSubmit}
        className={`ui large form${this.state.loading ? ' loading' : ''}`}
      >

        <div>
          <label
            htmlFor="email"
            style={styles.label}
          >
            Email
          </label>
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

        <div>
          <label
            htmlFor='password'
            style={styles.label}
          >
            Password
          </label>
          <input
            type='password'
            placeholder='password'
            name='password'
            required
            onChange={this.handleChange}
            value={this.state.password}
            style={styles.input}
          />
        </div>

        { this.props.type == 'register' &&
          <div>
            <label
              htmlFor='password2'
              style={styles.label}
            >
              Password
            </label>
            <input
              type='password'
              placeholder='confirm password'
              name='password2'
              required
              onChange={this.handleChange}
              value={this.state.password2}
              style={styles.input}
            />
          </div>
        }

        { this.props.type == 'login' &&
          <div style={{marginTop: '10px'}}>
            <Link
              to='/login/recover'
              style={styles.link}
            >
              Forgot your password?
            </Link>
          </div>
        }

        { this.props.type == 'login' &&
          <div style={{marginTop: '10px'}}>
            <Link
              to='/login/register'
              style={styles.link}
            >
              Register
            </Link>
          </div>
        }

        <button
          type='submit'
          style={styles.button}
        >
          { this.props.type == 'login' ? 'Sign In' : 'Register'}
        </button>
      </form>
    );
  }
}


export default PasswordForm;
