import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Typography from '@material-ui/core/Typography';
import WbSunnyIcon from '@material-ui/icons/WbSunny';

import NChangerAvatar from './NChangerAvatar';
import NThingIcon from './NThingIcon';

const styles = {
  root: {
    flex: '1 1 auto',
    height: '100px',
    overflowY: 'auto',
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px'
  },
  entryText: {
    marginLeft: '5px',
    marginRight: '5px'
  }
};

//
class NChangeActivity extends Component {

  scrollToBottom = () => {
    this.activitiesEnd &&
      this.activitiesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { activity, classes, history } = this.props;

    return (
      <div className={classes.root }>
        {
          activity && activity.map(this.renderActivityEntry)
        }
        {/*div at the bottom, used for scrolling to bottom */}
        <div ref={(el) => { this.activitiesEnd = el; }}> </div>
      </div>
    );
  }

  renderActivityEntry = (entry, i) => {
    const { classes } = this.props;

    const renderActivityEntry = {
      create: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            creó el nchange
          </Typography>
        </div>
      ),
      take: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            quiere 1
          </Typography>
          <NThingIcon nThingId={entry.nThing}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            de
          </Typography>
          <NChangerAvatar nChangerId={entry.from}/>
        </div>
      ),
      release: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            ya no quiere 1
          </Typography>
          <NThingIcon nThingId={entry.nThing}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            de
          </Typography>
          <NChangerAvatar nChangerId={entry.from}/>
        </div>
      ),
      offer: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            ofrece 1
          </Typography>
          <NThingIcon nThingId={entry.nThing}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            a
          </Typography>
          <NChangerAvatar nChangerId={entry.to}/>
        </div>
      ),
      retrieve: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            recupera
          </Typography>
          <NThingIcon nThingId={entry.nThing}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            de
          </Typography>
          <NChangerAvatar nChangerId={entry.from}/>
        </div>
      ),
      approve:(
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user} thumbsUp/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            aprueba el nchange
          </Typography>
        </div>
      ),
      unapprove: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            dejó de aprobar el nchange
          </Typography>
        </div>
      ),
      addnchanger: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            agregó a
          </Typography>
          <NChangerAvatar nChangerId={entry.addedNchanger}/>
        </div>
      ),
      chatmessage:(
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            dice: {entry.message}
          </Typography>
        </div>
      ),
      leave: (
        <div className={classes.entry} key={i}>
          <NChangerAvatar nChangerId={entry.user}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            abandona este nChange
          </Typography>
        </div>
      ),
      remove: (
        <div className={classes.entry} key={i}>
          <NThingIcon nThingId={entry.nThing}/>
          <Typography noWrap variant="h6" className={classes.entryText}>
            ya no está disponible
          </Typography>
        </div>
      ),
      finish:(
        <div className={classes.entry} key={i}>
          <WbSunnyIcon/>
          <Typography noWrap variant="h5" className={classes.entryText}>
            nChange finalizado
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
