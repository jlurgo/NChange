import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { _ } from 'meteor/underscore';

const Tags = new Mongo.Collection('tags');

const styles = {
  root: {
    height: '50px',
    paddingTop: '5px',
    paddingBottom: '5px'
  }
};

// Tag selector for filtering
class ItemFilterBar extends Component {

  state = {
    selectedTags: []
  }
  handleTagsChange = (event, tags) => {
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
    const tags = this.props.tags.sort();
    return (
      <div className={this.props.classes.root}>
        <Autocomplete options={tags}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label=""
              placeholder="Tags"
            />
          )}
          onChange={this.handleTagsChange}
          noOptionsText="No hay mas tags"
          fullWidth
          multiple
          filterSelectedOptions
          autoHighlight
          autoSelect
          disableCloseOnSelect
        />
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe('tags', props.filter);
  return {
    ...props,
    tags: Tags.find({}).fetch().map( tag => tag._id)
  };
})(withStyles(styles)(ItemFilterBar));
