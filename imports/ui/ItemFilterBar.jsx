import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = {
  root: {
    height: '50px',
    paddingTop: '5px',
    paddingBottom: '5px'
  }
};

// App component - represents the whole app
class ItemFilterBar extends Component {
  handleTextChange = (e) => {
    console.warn(e.target.value);
    const text = e.target.value;
    const tags = text.split(' ');
    this.props.onFilterChange(tags);
  }
  render() {
    const { filter } = this.props;
    const text = filter.join(' ');
    return (
      <div className={this.props.classes.root}>
        <TextField label="Filtros" type="search" variant="outlined"
          fullWidth={true} value={text} onChange={this.handleTextChange}/>
      </div>
    );
  }
}

export default withStyles(styles)(ItemFilterBar);
