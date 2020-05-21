import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    position: 'relative'
  },
  disabledButton: {
    backgroundColor: 'gray !important',
    cursor: 'unset'
  },
  sliderContainer: {
    position: 'absolute',
    top: '35px',
    left: '-1px',
    bottom: '35px',
    right: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: {
    width: '0px !important'
  },
  button: {
    width: '40px',
    height: '35px',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },
  plus: {
    alignItems: 'start',
    paddingTop: '5px',
    backgroundColor: '#41b53f',
    borderRadius: '15px 15px 0px 0px'
  },
  minus: {
    alignItems: 'flex-end',
    paddingBottom: '5px',
    backgroundColor: '#41b53f',
    borderRadius: '0px 0px 15px 15px',
  },
  disabled: {
    backgroundColor: 'gray',
  },
  selectingValue: {
    position: 'absolute',
    right: '110%',
    top: '25%'
  }
};

//
class SelectQtyButton extends Component {

  state = {
    selectingValue: false,
    valueInSlide: 50,
  }

  handlePlusClick = (e) => {
    const { nThing, nChange, nChangerId } = this.props;
    if(nChange.getRemainingThingStock(nThing) > 0) {
      const qty = nChange.thingQtyTakenBy(nThing._id, nChangerId) + 1;
      Meteor.call('nchanges.takeItem', nChange._id, nChangerId,
        nThing._id, qty);
    }
    e.stopPropagation();
  }

  handleMinusClick = (e) => {
    const { nThing, nChange, nChangerId } = this.props;
    if(nChange.thingQtyTakenBy(nThing._id, nChangerId) > 0) {
      const qty = nChange.thingQtyTakenBy(nThing._id, nChangerId) - 1;
      Meteor.call('nchanges.takeItem', nChange._id, nChangerId,
        nThing._id, qty);
    }
    e.stopPropagation();
  }

  handleValueSelected = (e, v) => {
    const { nThing, nChange, nChangerId } = this.props;
    const { valueBeingSelected } = this.state;
    this.lastTimeout && Meteor.clearTimeout(this.lastTimeout);
    this.setState({
      selectingValue: false,
      valueInSlide: 50
    });
    e.stopPropagation();
    Meteor.call('nchanges.takeItem', nChange._id, nChangerId,
      nThing._id, valueBeingSelected);
  }

  getValueFromSlide = (slide_value) => {
    const { nThing, nChange, nChangerId } = this.props;
    const { valueBeingSelected } = this.state;
    const ret_value = (valueBeingSelected ? valueBeingSelected : 0) +
      (
        Math.floor(Math.abs(slide_value - 50)/10) *
        ((slide_value >= 50) ? 1 : -1)
      )
    if (ret_value < 0) return 0;
    const remaining_stock = nChange.getRemainingThingStock(nThing, nChangerId);
    if (ret_value > remaining_stock) return remaining_stock;
    return ret_value;
  }

  updateValueBeingSelectedPeriodically = (period) => {
    if (!this.state.selectingValue) return
    this.lastTimeout = Meteor.setTimeout(() => {
      this.setState({
        valueBeingSelected: this.getValueFromSlide(this.state.valueInSlide)
      });
      this.updateValueBeingSelectedPeriodically();
    }, 50 * (6 - Math.floor(Math.abs(this.state.valueInSlide - 50)/10)));
    //Math.floor(Math.abs(slide_value - 50)/10) Math.pow((50 - Math.abs(this.state.valueInSlide - 50)) + 1, 1.5));
  }

  handleValueSelecting = _.throttle((e, new_slide_value) => {
    const { nThing, nChange, nChangerId } = this.props;
    const { selectingValue, valueBeingSelected } = this.state;
    if (!selectingValue) {
      this.setState({
        selectingValue: true,
        valueBeingSelected: nChange.thingQtyTakenBy(nThing._id, nChangerId)
      });
      return;
    }
    this.lastTimeout && Meteor.clearTimeout(this.lastTimeout);
    this.updateValueBeingSelectedPeriodically();
    this.setState({
      valueInSlide: new_slide_value,
      valueBeingSelected: this.getValueFromSlide(new_slide_value)
    });
  }, 200);

  render() {
    const { nThing, nChange, nChangerId, classes,
      onPlusClick, onMinusClick } = this.props;
    const { valueInSlide, selectingValue, valueBeingSelected } = this.state;

    let plus_button_classes = classes.button + ' ' + classes.plus;
    if (nChange.getRemainingThingStock(nThing) <= 0)
      plus_button_classes += ' ' + classes.disabled;

    let minus_button_classes = classes.button + ' ' + classes.minus;
      if (nChange.thingQtyTakenBy(nThing._id, nChangerId) <= 0)
        minus_button_classes += ' ' + classes.disabled;
    //console.warn('render', this.getValueFromSlide(valueInSlide));
    return (
      <div className={classes.root } onClick={(e) => {e.stopPropagation();}}>
        <div className={plus_button_classes}
          onClick={this.handlePlusClick}>
          <AddIcon fontSize= 'small'/>
        </div>
        <div className={classes.sliderContainer}
          style={selectingValue ? {top: '0px', bottom: '0px'} : {}}>
          <Slider
            orientation="vertical"
            value={valueInSlide}
            track={false}
            classes={{rail:classes.rail}}
            onChangeCommitted={this.handleValueSelected}
            onChange={this.handleValueSelecting}
          />
        </div>
        { selectingValue &&
          <Typography noWrap variant="h5" className={classes.selectingValue}>
            {valueBeingSelected ? valueBeingSelected : 0}
          </Typography>
        }
        <div className={minus_button_classes}
          onClick={this.handleMinusClick}>
          <RemoveIcon fontSize= 'small'/>
        </div>
      </div>
    );
  }
}

// <Joystick managerListener={this.handleJoystickCreate}
// containerStyle={styles.joystick} joyOptions={joy_opts}/>
export default withStyles(styles)(SelectQtyButton);
