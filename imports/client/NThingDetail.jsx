import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Items } from "../shared/collections";

const styles = {
  root: {

  },
};

//
class NThingDetail extends Component {
  render() {
    const { nThing, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <Paper classes={{ root: classes.root }}>
        <div className={classes.picsContainer}>
          {
            nThing.pics.map((pic) =>{
              return (
                <img src={pic} alt={nThing.shortDescription}
                  className={classes.pic}/>
              )
            })
          }
        </div>
        <Typography variant="h6">
          {nThing.longDescription}
        </Typography>
      </Paper>
    );
  }
}

export default withRouter(withTracker((props) => {
  const item_sub = Meteor.subscribe('nthing_detail', props.match.params.id);
  return {
    loading: !item_sub.ready(),
    nThing: Items.findOne({_id: props.match.params.id})
  };
})
(withStyles(styles)(NThingDetail)));
