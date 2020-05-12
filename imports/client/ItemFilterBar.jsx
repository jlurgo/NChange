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
    backgroundColor: 'white',
    borderRadius: '5px'
  },
  autocompletePaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  autocompleteOption: {
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '18px',
  }
};

// Tag selector for filtering
class ItemFilterBar extends Component {

  state = {
    selectedTags: []
  }
  handleTagsChange = (tags) => {
    const filter = {};
    if(tags.length > 0) {
      filter.tags = {
        $all: tags
      }
    }
    this.props.onFilterChange(filter);
    this.setState({
      selectedTags: tags
    });
  }
  render() {
    const { tags, classes} = this.props;
    const { selectedTags } = this.state;

    return (
      <div className={this.props.classes.root}>
        <TagSelectBar selectedTags={selectedTags}
          onTagsChange={this.handleTagsChange}/>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe('tags', props.filter);
  return {
    ...props,
    tags: Tags.find({}).fetch().map( tag => tag._id).sort()
  };
})(withStyles(styles)(ItemFilterBar));
