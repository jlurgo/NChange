import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    position: 'relative',
    height: '44px',
    width: '44px',
    backgroundColor: '#41b53f',
    borderRadius: '50%',
    display: 'flex'
  },
  disabledButton: {
    backgroundColor: 'gray !important',
    cursor: 'unset'
  },
  sliderContainer: {
    marginTop: '7px',
    marginLeft: '-3px',
  },
  rail: {
    width: '0px !important'
  },
  thumb: {
    width: '20px',
    height: '20px'
  },
  plus: {
    backgroundColor: '#41b53f',
  },
  minus: {
    backgroundColor: '#41b53f',
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

    const plus_button_classes = classes.button + ' ' + classes.plus;
    const minus_button_classes = classes.button + ' ' + classes.minus;

    let show_plus_button = false;
    let show_minus_button = false;
    let show_slider = false;

    if (nChange.getRemainingThingStock(nThing, nChangerId) == 1) {
      if (nChange.thingQtyTakenBy(nThing._id, nChangerId) == 0) {
        show_plus_button = true;
      } else if (nChange.thingQtyTakenBy(nThing._id, nChangerId) == 1) {
        show_minus_button = true;
      }
    }

    if (nChange.getRemainingThingStock(nThing, nChangerId) > 1)
      show_slider = true;

    return (
      <div className={classes.root } onClick={(e) => {e.stopPropagation();}}>
        { show_plus_button &&
          <IconButton className={plus_button_classes}
            onClick={this.handlePlusClick}>
            <AddIcon fontSize= 'small'/>
          </IconButton>
        }
        { show_minus_button &&
          <IconButton className={minus_button_classes}
            onClick={this.handleMinusClick}>
            <RemoveIcon fontSize= 'small'/>
          </IconButton>
        }
        { show_slider &&
          <div className={classes.sliderContainer}>
            <Slider
              orientation="vertical"
              value={valueInSlide}
              track={false}
              classes={{rail:classes.rail, thumb: classes.thumb}}
              onChangeCommitted={this.handleValueSelected}
              onChange={this.handleValueSelecting}
            />
          </div>
        }
        { selectingValue &&
          <Typography noWrap variant="h5" className={classes.selectingValue}>
            {valueBeingSelected ? valueBeingSelected : 0}
          </Typography>
        }

      </div>
    );
  }
}

// <Joystick managerListener={this.handleJoystickCreate}
// containerStyle={styles.joystick} joyOptions={joy_opts}/>
export default withStyles(styles)(SelectQtyButton);
