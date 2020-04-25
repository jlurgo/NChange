import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { _ } from 'meteor/underscore';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';
import ItemInChange from './ItemInChange';
import Typography from '@material-ui/core/Typography';

import { Items } from '../api/items.js';

const styles = {
  root: {
    display: 'flex',
    marginBottom: '5px'
  },
  itemSection: {
    flex: '1 1 100px',
    display: 'flex',
    flexDirection: 'column',
  },
  itemList: {
    flex: '1 1 100px',
    display: 'flex',
  },
  sectionTitle: {
  },
  titleBar: {
    backgroundColor: '#41b53f',
    color: 'white',
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
    borderBottom: '2px black dashed'
  }
};


// Item component - represents a single todo item
class NChangeInList extends Component {

  renderItems(items) {
    return items.map((item) => {
      return (
        <ItemInChange
          key={item.nThing}
          itemInChange={item}
        />
      );
    });
  }

  render() {
    const { nchange, classes } = this.props;

    const user_input_items = _.where(nchange.actions,
      { action: 'take', user: Meteor.userId()});

    const user_output_items = _.where(nchange.actions,
      { action: 'take', from: Meteor.userId()});

    return (
      <Paper className={classes.root}>
        <div className={classes.itemSection}>
          <div className={classes.titleBar}>
            <Typography noWrap variant="h6" className={classes.sectionTitle}> Input </Typography>
          </div>
          <div className={classes.itemList} style={{borderRight: '2px dashed black'}}>
            { this.renderItems(user_input_items) }
          </div>
        </div>
        <div className={classes.itemSection}>
          <div className={classes.titleBar}>
            <Typography noWrap variant="h6" className={classes.sectionTitle}> Output </Typography>
          </div>
          <div className={classes.itemList}>
            { this.renderItems(user_output_items) }
          </div>
        </div>
      </Paper>
    );
  }
}

export default withTracker((props) => {
  return { props };
})(withStyles(styles)(NChangeInList));
