import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { Tags } from "./collections";

import TagSelectBar from './TagSelectBar';

const styles = {
  root: {
  },
};

// Tag selector for filtering
class NThingFilterBar extends Component {
  state = {
    selectedTags: []
  }

  handleTagsChange = (tags) => {
    const { filter, onFilterChange } = this.props;
    if(tags.length > 0) {
      filter.tags = {
        $all: tags
      };
    } else {
      delete filter.tags;
    }
    onFilterChange(filter);
    this.setState({
      selectedTags: tags
    });
  }

  render() {
    const { classes} = this.props;
    const { selectedTags } = this.state;

    return (
      <TagSelectBar selectedTags={selectedTags}
        onTagsChange={this.handleTagsChange}/>
    );
  }
}

export default withStyles(styles)(NThingFilterBar);
