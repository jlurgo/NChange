import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { Tags } from "./collections";

import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    display: 'flex',
    flex: '0 0 40px',
    padding: '10px',
    flexDirection: 'column'
  },
  input: {
    display: 'inline',
    width: '1px',
    height: '15px',
    marginTop: '0px',
    overflow: 'hidden'
  },
  tagList: {
    display: 'flex',
    overflowX: 'auto'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px',
    paddingLeft: '15px',
    paddingRight: '15px',
    borderRadius: '25px',
    backgroundColor: '#e8ffe2',
    '&:hover': {
      backgroundColor: '#b8ffe2',
    },
  },
  selected: {
    backgroundColor: '#93f793',
  },
  emptySearch: {
    color: 'gray'
  }
};

// Tag selector for filtering
class TagSelectBar extends Component {

  state = {
    searchText: '',
    searching: false
  }

  handleSearchChange = (e) => {
    this.setState({
      searchText: e.target.value.toLowerCase()
    });
  }

  handleSearchBlur = (e) => {
    // this.setState({
    //   searchText: '',
    //   searching: false
    // });
  }

  handleSearchClick = () => {
    this.setState({
      searchText: '',
      searching: !this.state.searching
    });
  }

  handleKeyPress = (e) => {
    const { selectedTags, classes } = this.props;
    const { searching, searchText } = this.state;

    switch (e.keyCode) {
      case 27: // esc
        break;
      case 13: // enter
        if(!searchText) break;
        const new_tags = _.union(selectedTags, [this.camelizeTag(searchText)]);
        this.props.onTagsChange(new_tags);
        break;
      default:
        return;
    }
    this.setState({
      searchText: '',
      searching: false
    });
  }

  render() {
    const { selectedTags, tags, classes} = this.props;
    const { searchText, searching } = this.state;

    const tags_not_selected = _.difference(tags, selectedTags);
    const filtered_tags = _.filter(tags_not_selected, (tag) => {
      return tag.indexOf(this.camelizeTag(searchText)) >= 0;
    });
    return (
      <div className={classes.root}>
        <div className={classes.tagList}>
          {selectedTags && selectedTags.map(this.renderSelectedTag)}
          { searching ? this.renderSearchTag() :
            <IconButton className={classes.search}
              onClick={this.handleSearchClick}>
              <SearchIcon fontSize= 'small'/>
            </IconButton>
          }
          {filtered_tags.map(this.renderProposedTag)}
        </div>
      </div>
    )
  }

  camelizeTag = (tag) => {
    return tag.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  renderSearchTag = () => {
    const { selectedTags, classes } = this.props;
    const { searching, searchText } = this.state;
    return (
      <div className={classes.tag + ' ' + classes.searchTag} key={'searching'}
        onClick={() => {
          const new_tags = _.union(selectedTags, [this.camelizeTag(searchText)]);
          if(searchText) this.props.onTagsChange(new_tags);
          this.setState({
            searchText: '',
            searching: false
          });
        }}>
        <Typography variant="h6">
          {this.camelizeTag(searchText) }
        </Typography>
        <div className={classes.input}>
          <TextField value={searchText} onChange={this.handleSearchChange}
            autoFocus onKeyDown={this.handleKeyPress}
            onBlur={this.handleSearchBlur}
            inputProps={{ 'aria-label': 'naked' }}/>
        </div>
      </div>
    );
  }

  renderSelectedTag = (tag) => {
    const { selectedTags, classes } = this.props;
    return (
      <div className={classes.tag + ' ' + classes.selected} key={tag}
        onClick={() => {
          const new_tags = _.without(selectedTags, tag);
          this.props.onTagsChange(new_tags);
          this.setState({
            searchText: '',
            searching: false
          });
        }}>
        <Typography variant="h6">
          {tag}
        </Typography>
      </div>
    );
  }

  renderProposedTag = (tag) => {
    const { selectedTags, classes} = this.props;
    return (
      <div className={classes.tag} key={tag}
        onClick={() => {
          const new_tags = _.union(selectedTags, [this.camelizeTag(tag)]);
          this.props.onTagsChange(new_tags);
          this.setState({
            searchText: '',
            searching: false
          });
        }}>
        <Typography variant="h6">
          {tag}
        </Typography>
      </div>
    );
  }
}

export default withTracker((props) => {
  const filter = {};
  if(props.selectedTags && props.selectedTags.length > 0) {
    filter.tags = {
      $all: props.selectedTags
    }
  }
  Meteor.subscribe('tags', filter);
  return {
    selectedTags: props.selectedTags || [],
    tags: Tags.find({}).fetch().map( tag => tag._id).sort()
  };
})(withStyles(styles)(TagSelectBar));
