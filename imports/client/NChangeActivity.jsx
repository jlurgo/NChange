import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Typography from '@material-ui/core/Typography';

import NChangerAvatar from './NChangerAvatar';

const styles = {
  root: {
    flex: '1 1 auto',
    height: '100px',
    overflowY: 'auto'
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
  },
  entryText: {
    marginLeft: '5px',
    marginRight: '5px'
  }
};

//
class NChangeActivity extends Component {
  render() {
    const { activity, classes, history } = this.props;

    return (
      <div className={classes.root }>
        {
          activity.map((entry)=>{
            return this.renderActivityEntry(entry)
          })
        }
      </div>
    );
  }

  renderActivityEntry = (entry) => {
    const { classes } = this.props;

    const renderActivityEntry = {
      create: (
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            creó el nchange
          </Typography>
        </div>
      ),
      take: (
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            agarró un item
          </Typography>
        </div>
      ),
      release: (
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            soltó un item
          </Typography>
        </div>
      ),
      approve:(
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user} thumbsUp/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            aprueba el nchange
          </Typography>
        </div>
      ),
      unapprove: (
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            dejó de aprobar el nchange
          </Typography>
        </div>
      ),
      addnchanger: (
        <div className={classes.entry}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            agregó a
          </Typography>
          <NChangerAvatar nChangerId={entry.addedNchanger}/>
        </div>
      ),
      finish:(
        <div className={classes.entry}>
          <Typography noWrap variant="h6" className={classes.entryText}>
            NCHANGE FINALIZADO
          </Typography>
        </div>
      ),
    }
    return renderActivityEntry[entry.action];
  }
}


export default withTracker((props) => {
  return props;
})
(withRouter(withStyles(styles)(NChangeActivity)));
