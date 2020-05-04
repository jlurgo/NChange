import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

const styles = {
  root: {

  },
};

//
class NChangeActivity extends Component {
  render() {
    const { activity, classes, history } = this.props;

    return (
      <div className={classes.root }>
        {
          activity.map((entry)=>{
            return this.renderActivityEntryHandlers[entry.action](entry)
          })
        }
      </div>
    );
  }

  renderActivityEntryHandlers = {
    create: (entry) => {
      return (
        <div> Se creó el nchange </div>
      )
    },
    take: (entry) => {
      return (
        <div> Uno agarró un item </div>
      )
    },
    release: (entry) => {
      return (
        <div> Uno soltó un item </div>
      )
    },
    approve: (entry) => {
      return (
        <div> Uno aprobó el nchange </div>
      )
    },
    unapprove: (entry) => {
      return (
        <div> Uno dejó de aprobar el nchange </div>
      )
    },
    addnchanger: (entry) => {
      return (
        <div> se agregó un nChanger </div>
      )
    },
    finish: (entry) => {
      return (
        <div> NCHANGE FINALIZADO </div>
      )
    }
  }
}


export default withTracker((props) => {
  return props;
})
(withRouter(withStyles(styles)(NChangeActivity)));
