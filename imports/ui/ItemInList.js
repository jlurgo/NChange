import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Items } from '../api/items.js';

// Task component - represents a single todo item
export default class ItemInList extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('items.setChecked', this.props.item._id, !this.props.item.checked);
  }

  deleteThisTask() {
    Meteor.call('items.remove', this.props.item._id);
  }

  togglePrivate() {
    Meteor.call('items.setPrivate', this.props.item._id, ! this.props.item.private);
  }

  render() {
    // Give items a different className when they are checked off,
    // so that we can style them nicely in CSS
    const itemClassName = classnames({
      checked: this.props.item.checked,
      private: this.props.item.private,
    });

    return (
      <li className={itemClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.item.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.item.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.item.username}</strong>: {this.props.item.text}
        </span>
      </li>
    );
  }
}
