import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = {
  root: {
    height: '50px',
    padding: '5px'
  }
};

// App component - represents the whole app
class ItemFilterBar extends Component {

  render() {
    return (
      <div className={this.props.classes.root}>
        <TextField label="Filtros" type="search" variant="outlined" fullWidth={true} />
      </div>
    );
  }
}

export default withTracker((props) => {
  return props;
})(withStyles(styles)(ItemFilterBar));
