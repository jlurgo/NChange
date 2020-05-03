import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import { NChanges } from "../shared/collections";

import Typography from '@material-ui/core/Typography';

import NChangeInList from './NChangeInList';
import NChangerAvatar from './NChangerAvatar';
import ItemList from './ItemList';

const styles = {
  root: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  detailBar: {

  },
  bottomSection: {
    flex: '1 1 auto',
    height: '100px',
    display: 'flex',
    backgroundColor: 'white'
  },
  historySection: {
    flex: '1 1 50%'
  },
  historyTitle: {

  },
  thingsSection: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  nChangers: {
    flex: '0 0 auto',
    display: 'flex'
  },
  nThings: {
    flex: '1 1 auto'
  },
};

//
class NChangeDetail extends Component {
  render() {
    const { nchange, loading, classes, history } = this.props;

    if (loading) return <div>Loading...</div>

    return (
      <div className={classes.root }>
        <NChangeInList
          key={nchange._id}
          nchange={nchange}
        />
        <div className={classes.bottomSection}>
          <div className={classes.historySection}>
            <Typography noWrap variant="h6" className={classes.historyTitle}>
              Discusion
            </Typography>
          </div>
          <div className={classes.thingsSection}>
            <div className={classes.nChangers}>
              {
                nchange.nChangers.map(this.renderNChanger)
              }
            </div>
            <div className={classes.nThings}>
              <ItemList filter={{owner: { $in: nchange.nChangers }}}
                classes={{root: classes.listRoot}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderNChanger = (n_changer_id) => {
    return (
      <NChangerAvatar nChangerId={n_changer_id} key={n_changer_id}/>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.match.params.id;
  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  if (!nchange_sub.ready()) return { loading: true };
  const n_change = NChanges.findOne({_id: nchange_id});
  return {
    nchange: n_change
  };
})
(withStyles(styles)(NChangeDetail)));
