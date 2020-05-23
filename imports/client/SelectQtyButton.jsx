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
  sliderButtonOverlay: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    left: '0px',
    bottom: '0px',
    backgroundColor: '#41b53f',
    borderRadius: '50%',
    zIndex: '1'
  },
  sliderContainer: {
    position: 'absolute',
    top: '-30px',
    right: '0px',
    left: '0px',
    bottom: '-30px',
  },
  slider: {
    position: 'absolute',
    top: '4px',
    right: '0px',
    left: '17px',
    bottom: '0px',
    padding: '0px !important'
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
    top: '12%',
    right: '79%',
    backgroundColor: 'gray',
    color: 'white',
    paddingLeft: '15px',
    paddingTop: '2px',
    paddingBottom: '0px',
    paddingRight: '15px',
    zIndex: '0',
    borderRadius: '17px 0px 0px 17px',
  },
  microPlusIcon: {
    position: 'absolute',
    top: '-8px',
    right: '14px',
    height: '16px',
    width: '16px',
    textAlign: 'center',
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: '50%',
  },
  microMinusIcon: {
    position: 'absolute',
    bottom: '-8px',
    right: '14px',
    height: '16px',
    width: '16px',
    textAlign: 'center',
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: '50%',
  },
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

    e.stopPropagation();
    this.lastTimeout && Meteor.clearTimeout(this.lastTimeout);
    this.setState({
      selectingValue: false,
      valueInSlide: 50
    });
    Meteor.call('nchanges.takeItem', nChange._id, nChangerId,
      nThing._id, valueBeingSelected);
  }

  getValueFromSlide = (slide_value, new_middle_value) => {
    const { nThing, nChange, nChangerId } = this.props;
    const { valueBeingSelected, middleValue } = this.state;

    const slide_value_centered = slide_value - 50;
    const ret_value = middleValue + Math.floor((slide_value_centered / 5));
    if (ret_value < 0) return 0;
    const remaining_stock = nChange.getRemainingThingStock(nThing, nChangerId);
    if (ret_value > remaining_stock) return remaining_stock;
    return ret_value;
  }

  updateMiddleValuePeriodically = () => {
    const { nThing, nChange, nChangerId } = this.props;
    const { valueBeingSelected, middleValue, valueInSlide } = this.state;
    this.lastTimeout && Meteor.clearTimeout(this.lastTimeout);
    if (!this.state.selectingValue) return
    const remaining_stock = nChange.getRemainingThingStock(nThing, nChangerId);
    let increment = Math.sign(valueInSlide - 50);
    if((Math.abs(valueInSlide - 50) - 40) == 10) increment = increment * 5;

    let new_middle_value = parseInt(middleValue) + increment;
    if(new_middle_value <= 0) new_middle_value = 0;
    if(new_middle_value >= remaining_stock) new_middle_value = remaining_stock;

    let new_value_being_selected = this.getValueFromSlide(valueInSlide, new_middle_value)
    if (new_value_being_selected <= 0) new_value_being_selected = 0;
    if (new_value_being_selected >= remaining_stock) new_value_being_selected = remaining_stock;

    const new_state = {
      middleValue: new_middle_value,
      valueBeingSelected: new_value_being_selected,
    }
    this.setState(new_state);

    const new_interval = ((Math.abs(valueInSlide - 50) - 40) == 10) ? 30 : 200;

    this.lastTimeout = Meteor.setTimeout(() => {
      this.updateMiddleValuePeriodically();
    }, new_interval);
  }

  handleValueSelecting = _.throttle((e, new_slide_value) => {
    const { nThing, nChange, nChangerId } = this.props;
    const { selectingValue, valueBeingSelected } = this.state;
    if (!selectingValue) {
      const actual_take = nChange.thingQtyTakenBy(nThing._id, nChangerId);
      this.setState({
        selectingValue: true,
        valueBeingSelected: actual_take,
        middleValue: actual_take,
      });
      return;
    }
    const new_state = {
      valueInSlide: new_slide_value,
    };
    if(Math.abs(new_slide_value - 50) >= 40){
      this.updateMiddleValuePeriodically();
    } else {
      this.lastTimeout && Meteor.clearTimeout(this.lastTimeout);
      new_state.valueBeingSelected = this.getValueFromSlide(new_slide_value);
    }
    this.setState(new_state);
  }, 50, {trailing: false});

  render() {
    const { nThing, nChange, nChangerId, classes,
      onPlusClick, onMinusClick } = this.props;
    const { valueInSlide, selectingValue, valueBeingSelected, middleValue } = this.state;

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
          <div className={classes.sliderButtonOverlay}>
            <div className={classes.microPlusIcon}> + </div>
            <div className={classes.microMinusIcon}> - </div>
            <div className={classes.sliderContainer}>
              <Slider
                orientation="vertical"
                value={valueInSlide}
                track={false}
                classes={{root: classes.slider, rail:classes.rail, thumb: classes.thumb}}
                onChangeCommitted={this.handleValueSelected}
                onChange={this.handleValueSelecting}
              />
            </div>
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

export default withStyles(styles)(SelectQtyButton);
