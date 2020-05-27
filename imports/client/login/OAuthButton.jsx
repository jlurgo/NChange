import React from 'react';
import utils from './utils';

const styles = {
  button: {
    width: '100%',
    height: '3rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'white'
  },
}

class OAuthButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ loading: true });

    utils.performOAuthLogin(this.props.service, (err) => {
      this.setState({
        loading: false,
        error: err ? err.message : null,
      });
    });
  }

  render() {
    let { service } = this.props;

    // some meteor -> semantic name mappings for nice styling
    if (service === 'google') {
      service += ' plus';
    }

    if (this.state.error) {
      return (
        <button
          style={styles.button}
        >
          <i/> {this.state.error}
        </button>
      );
    }

    if (this.state.loading) {
      return (
        <button
          style={styles.button}
        >
          loading
        </button>
      );
    }

    return (
      <button
        style={styles.button}
        onClick={this.handleClick}
      >
        <i/> {this.props.text}
      </button>
    );
  }
}

export default OAuthButton;
