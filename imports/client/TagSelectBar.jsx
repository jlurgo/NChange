import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { _ } from 'meteor/underscore';

import { Tags } from "./collections";

const styles = {
  root: {
    height: '50px',
    backgroundColor: 'white',
    padding: '5px',
    paddingBottom: '10px',
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
class TagSelectBar extends Component {

  handleTagsChange = (event, tags) => {
    this.props.onTagsChange(tags);
  }

  render() {
    const { selectedTags, tags, classes} = this.props;

    return (
      <div className={this.props.classes.root}>
        <Autocomplete options={tags}
          value={selectedTags}
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
          freeSolo
          filterSelectedOptions
          autoHighlight
          disableCloseOnSelect
          getOptionSelected= {(tag_a, tag_b) => tag_a == tag_b}
          debug= {true}
          classes={{
            paper: classes.autocompletePaper,
            option: classes.autocompleteOption,
          }}
        />
      </div>
    );
  }
}

export default withTracker((props) => {
  const filter = {};
  if(props.selectedTags.length > 0) {
    filter.tags = {
      $all: props.selectedTags
    }
  }
  Meteor.subscribe('tags', filter);
  return {
    ...props,
    tags: Tags.find({}).fetch().map( tag => tag._id).sort()
  };
})(withStyles(styles)(TagSelectBar));
