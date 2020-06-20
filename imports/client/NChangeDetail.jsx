import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import NChange from "../shared/NChange"

import { NChanges } from "../shared/collections";

import ResizeDetector  from 'react-resize-detector';
import ChatIcon from '@material-ui/icons/Chat';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import NChangeInList from './NChangeInList';
import NChangerAvatar from './NChangerAvatar';
import NChangerSelector from './NChangerSelector';
import NThingFilterBar from './NThingFilterBar';
import AddNChangerButton from './AddNChangerButton';
import NThingList from './NThingList';
import NThingInList from './NThingInList';
import LeaveNChangeButton from './LeaveNChangeButton';


const styles = {
  root: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  topControlBar: {
    flex: '0 0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomControlBar: {
    flex: '0 0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  userFilter: {
    flex: '0 0 40px'
  },
  detailBox: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    boxShadow: 'inset 3px 3px 5px 0px rgba(0,0,0,0.75)'
  },
  topPanel: {    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    transition: 'flex 0.3s ease-out',
    overflowX: 'auto',
    borderBottom: '2px dashed black',
  },
  bottomPanel: {    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    transition: 'flex 0.3s ease-out',
    overflowX: 'auto'
  },
  topSummaryMode: {
    flex: '1 1 100px',
  },
  bottomSummaryMode: {
    flex: '1 1 100px',
  },
  topTakeMode: {
    flex: '0 0 170px',
  },
  bottomTakeMode: {
    flex: '1 1 100px',
    justifyContent: 'flex-start',
  },
  topOfferMode: {
    flex: '1 1 100px',
    justifyContent: 'flex-end',
  },
  bottomOfferMode: {
    flex: '0 0 170px',
  },
  thingsSection: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  nChangers: {
    flex: '0 0 auto',
    display: 'flex',
    paddingLeft: '15px',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    height: '79px'
  },
  nChangersList: {
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto'
  },
  menuButton: {
    flex: '0 0 auto',
    backgroundColor: '#9d9d9d61 !important'
  },
  addNchangerButton: {
    marginLeft: '10px'
  },
  leaveNchangeButton: {
    marginLeft: '10px'
  },
  nThings: {
    flex: '1 1 auto',
    height: '100px',
    overflowY: 'auto'
  },
  showAllButton: {
    height:' 69px',
    width: '69px',
  },
  showAllButtonSelected: {
    background: '-webkit-radial-gradient(circle, rgba(226,237,2,0) 40%, rgb(142, 193, 218) 50%, rgba(226,237,2,0) 70%)'
  },
  itemChoosingNchangerToOffer: {
    position: 'relative',
    flex: '1 1 100px',
    width: '100%',
    maxWidth: '400px'
  },
  chooseNchangerDialog: {
    position: 'absolute',
    backgroundColor: '#808080e8',
    display: 'flex',
    top: '13px',
    left: '9px',
    right: '0px',
    zIndex: '10',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white'
  },
  showActivityButton: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'yellow !important'
  },
};

//
class NChangeDetail extends Component {

  state = {
    selectedNChangerId: 'world',
    showActivity: false,
    openMenu: false,
    tagsFilter: {},
    mode: 'summary'
  }

  constructor() {
    super();
    this.rootRef = React.createRef();
  };

  addNChanger = (nchanger_id) => {
    const { nChange } = this.props;
    Meteor.call('nchanges.add_nchanger', nChange._id, nchanger_id,
      (err, res) => {
        if (err) alert('nChanger no encontrado');
      });
  }

  handleNchangerSelect = (nchanger_id) => {
    this.setState({
      selectedNChangerId: nchanger_id
    });
  }

  onResize = (width) => {
    this.setState({
      smallScreen: width<800
    })
  }

  showActivity = () => {
    this.setState({
      showActivity: !this.state.showActivity
    })
  }

  openMenu = (e) => {
    this.setState({
      openMenu: true,
      menuAnchor: e.currentTarget
    });
  }

  closeMenu = () => {
    this.setState({
      openMenu: false
    });
  }

  setTagsFilter = (filter) => {
    this.setState({ tagsFilter: filter });
  }

  setMode = (mode) => {    
    const { nChange } = this.props;
    const new_state = {
      mode: mode
    }
    if (mode == 'offer') {
      new_state.selectedNChangerId = nChange.nChangers.length > 1 ? 
        nChange.getOtherNchangersId(Meteor.userId())[0] :
        'no_selection'
    }
    this.setState(new_state);
  }

  render() {
    const { nChange, loading, classes, history } = this.props;
    const { mode, tagsFilter, smallScreen, showActivity, selectedNChangerId } = this.state;

    // if (loading) return <div>Loading...</div>
    const user_id = Meteor.userId();
    
    return (
      <div className={classes.root } ref={this.rootRef}>
        <div className={classes.topControlBar}>
          {(mode != 'offer') && <div className={classes.titleOfThingsSection}> Entrada </div> }
          {(mode == 'take') && 
            <IconButton onClick={() => this.setMode('summary')}>
              <ArrowBackIosIcon fontSize= 'small'/>
            </IconButton> 
          }          
          {(mode == 'summary') && 
            <IconButton onClick={() => this.setMode('take')}>
              <AddIcon fontSize= 'small'/>
            </IconButton>
          }
          {(mode == 'offer') && 
            <NThingFilterBar filter={tagsFilter} onFilterChange={this.setTagsFilter} />
          }
          {(mode == 'offer') &&  
            <NChangerSelector classes={{root:classes.userFilter}} 
              selectedNChangerId={selectedNChangerId}
              nChange={nChange} onSelect={this.handleNchangerSelect}/>
          }
        </div>
        <div className={classes.detailBox}>
          <div className={classnames(classes.topPanel, 
              (mode == 'summary') && classes.topSummaryMode,
              (mode == 'take') && classes.topTakeMode,
              (mode == 'offer') && classes.topOfferMode,
            )}>
            {!loading && (mode != 'offer') && this.renderInputThings()}
            {!loading && (mode == 'offer') && this.renderThingsToOffer()}
          </div>
          <div className={classnames(classes.bottomPanel, 
              (mode == 'summary') && classes.bottomSummaryMode,
              (mode == 'take') && classes.bottomTakeMode,
              (mode == 'offer') && classes.bottomOfferMode,
            )}>
            {!loading && (mode != 'take') && this.renderOutputThings()}
            {!loading && (mode == 'take') && this.renderThingsToPick()}
          </div>
        </div>
        <div className={classes.bottomControlBar}>
          {(mode != 'take') && <div className={classes.titleOfThingsSection}> Salida </div> }
          {(mode == 'offer') && 
            <IconButton onClick={() => this.setMode('summary')}>
              <ArrowBackIosIcon fontSize= 'small'/>
            </IconButton> 
          }   
          {(mode == 'summary') && 
            <IconButton onClick={() => this.setMode('offer')}>
              <AddIcon fontSize= 'small'/>
            </IconButton>
          }
          {(mode == 'take') && 
            <NThingFilterBar filter={tagsFilter} onFilterChange={this.setTagsFilter} />
          }
          {(mode == 'take') &&  
            <NChangerSelector classes={{root:classes.userFilter}} 
              selectedNChangerId={selectedNChangerId}
              nChange={nChange} onSelect={this.handleNchangerSelect}
              showWorldIcon showNChangeIcon/>
          }
        </div>
        <ResizeDetector handleWidth onResize={this.onResize} targetDomEl={this.rootRef.current} />
      </div>
    );
  }

  renderInputThings() {
    const { nChange, classes } = this.props;
    return nChange.getNchangerInputActions(Meteor.userId()).map((input_action) => {
      return (
        <NThingInList key={input_action.nThing} nThingId={input_action.nThing}
          nChange={nChange} nChangerId={Meteor.userId()}/>
      );
    });
  }

  renderOutputThings() {
    const { nChange, classes } = this.props;
    return nChange.getNchangerOutputActions(Meteor.userId()).map((input_action) => {
      return (
        <NThingInList key={input_action.nThing} nThingId={input_action.nThing}
          nChange={nChange} nChangerId={Meteor.userId()}/>
      );
    });
  }

  oldRender() {
    const { nChange, loading, classes, history } = this.props;
    const { selectedNChangerId, smallScreen, showActivity } = this.state;

    if (loading) return <div>Loading...</div>
    const user_id = Meteor.userId();

    return (
      <div className={classes.root } ref={this.rootRef}>
        {this.renderNchangersSection()}
        {(!smallScreen || !showActivity) && !nChange.approved && this.renderThingsSection()}
        { smallScreen && !nChange.approved &&
          <IconButton className={classes.showActivityButton} onClick={this.showActivity}>
            <ChatIcon fontSize= 'large'/>
          </IconButton>
        }
        <ResizeDetector handleWidth onResize={this.onResize}
          targetDomEl={this.rootRef.current} />
      </div>
    );
  }

  renderThingsToPick = () => {
    const { nChange, classes } = this.props;
    const { tagsFilter, selectedNChangerId } = this.state;

    const things_filter = tagsFilter;
    if (selectedNChangerId == 'nchange') {
      things_filter.owner = {
        $in: nChange.getOtherNchangersId(Meteor.userId())
      }
    } else if (selectedNChangerId == 'world') {
      things_filter.owner = {
        $ne: Meteor.userId()
      }
    } else {
      things_filter.owner = selectedNChangerId
    }
    return (
      <NThingList filter={things_filter} renderThing={this.renderThingInList}
          classes={{root: classes.listRoot}}/>
    );
  }

  renderThingsToOffer = () => {
    const { nChange, classes } = this.props;
    const { tagsFilter, selectedNChangerId } = this.state;

    const things_filter = tagsFilter;
    things_filter.owner = selectedNChangerId;

    return (
      <NThingList filter={things_filter} renderThing={this.renderThingInList}
          classes={{root: classes.listRoot}}/>
    );
  }

  renderThingInList = (nthing) => {
    const { nChange, classes } = this.props;
    const { selectedNChangerId } = this.state;

    return (
      <NThingInList key={nthing._id} nThing={nthing}
        nChange={nChange} nChangerId={Meteor.userId()}/>
    );
  }

  renderNchangersSection = () => {
    const { nChange, classes } = this.props;
    const { openMenu, menuAnchor } = this.state;
    return (
      <div className={classes.nChangers}>
        <div className={classes.nChangersList}>
          {this.renderNChanger(Meteor.userId())}
          {
          _.without(nChange.nChangers, Meteor.userId())
            .map(this.renderNChanger)
          }
        </div>
        {!nChange.approved &&
          <IconButton className={classes.menuButton} onClick={this.openMenu}>
            <MenuIcon fontSize= 'small'/>
          </IconButton>
        }
        <Menu
          id="customized-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={openMenu}
          onClose={this.closeMenu}
        >
          <MenuItem>
            <ListItemText primary="agregar participante" />
            <ListItemIcon>
              <AddNChangerButton classes={{ root: classes.addNchangerButton}}
              excludedNChangers={nChange.nChangers} onSelect={this.addNChanger}/>
            </ListItemIcon>
          </MenuItem>
          <MenuItem>
            <ListItemText primary="abandonar nchange" />
            <ListItemIcon>
              <LeaveNChangeButton nchange_id={nChange._id}
              classes={{ root: classes.leaveNchangeButton}}/>
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </div>
    );
  }

  renderNChanger = (nchanger_id) => {
    const { nChange, classes } = this.props;
    return (
      <NChangerAvatar nChangerId={nchanger_id} key={nchanger_id}
        thumbsUp={nChange.approvedBy(nchanger_id)}
        onClick={this.handleNchangerClick}
        selected={this.state.selectedNChangerId == nchanger_id}/>
    );
  }
}

export default withRouter(withTracker((props) => {
  const nchange_id = props.nChangeId || props.match.params.id;

  const nchange_sub = Meteor.subscribe('nchange_detail', nchange_id);
  if (!nchange_sub.ready()) return { loading: true };
  const n_change = NChanges.findOne({_id: nchange_id});
  return {
    nChange: new NChange(n_change)
  };
})
(withStyles(styles)(NChangeDetail)));
