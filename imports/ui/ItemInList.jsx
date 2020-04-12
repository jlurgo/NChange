import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { withStyles } from '@material-ui/core/styles';

import { Items } from '../api/items.js';

const styles = {
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  tileRoot: {
    flex: '0 0 300px',
    maxHeight: '300px',
    minHeight: '300px',
    margin: '5px',
    border: '1px dashed black'
  }
};


// Item component - represents a single todo item
class ItemInList extends Component {
  render() {
    const { item, classes } = this.props;
    return (
      <GridListTile key={item._id} cols={1} rows={1} classes={{
        root: classes.tileRoot
      }}>
        <img src={item.pics[0]} alt={item.text} />
        <GridListTileBar
          title={item.text}
          titlePosition="bottom"
          actionIcon={
            <IconButton aria-label={`star ${item.text}`} className={classes.icon}>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          }
          actionPosition="left"
          className={classes.titleBar}
        />
      </GridListTile>
    );
  }
}

export default withStyles(styles)(ItemInList);
// export default withTracker((props) => {
//   return props;
// })(ItemInList);
