import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Items } from '../api/items.js';

import ItemInList from './ItemInList.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('items.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderItems() {
    let filteredItems = this.props.items;
    return filteredItems.map((item) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = item.owner === currentUserId;

      return (
        <ItemInList
          key={item._id}
          item={item}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Items</h1>
          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="new-item" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new items"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderItems()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('items');

  return {
    items: Items.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
