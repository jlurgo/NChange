import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { _ } from 'meteor/underscore';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const styles = {
  root: {
    display: 'flex',
    marginTop: '5px'
  },
  valueLabel: {

  },
  errorMessage: {

  }
};

//
class EditableTextField extends Component {
  state = {
    editing: false,
    newValue: '',
    errorMessage: ''
  }

  handleValueChange = (e) => {
    this.setState({
      newValue: e.target.value,
      errorMessage: ''
    });
  }

  handleEdit = (e) => {
    this.setState({
      newValue: this.props.value,
      errorMessage: '',
      editing: true
    });
  }

  handleConfirm = (e) => {
    this.props.onChange(this.state.newValue, (err) => {
      this.setState({
        errorMessage: err.error
      });
      Meteor.setTimeout(() => {
        this.setState({
          errorMessage: ''
        });
      }, 4000);
    });
    this.setState({
      editing: false
    });
  }

  handleClose = (e) => {
    this.setState({
      newValue: this.props.value,
      errorMessage: '',
      editing: false
    });
  }

  render() {
    const { value, label, editable, classes } = this.props;
    const { editing, newValue, errorMessage } = this.state;

    return (
      <div className={classes.root }>
        { editing &&
          <TextField type="text" value={newValue} className={classes.valueLabel}
            variant="outlined" onChange={this.handleValueChange}
            label={label} autoFocus
          />
        }
        { !editing &&
          <Typography variant="h4">
            { value }
          </Typography>
        }
        { editing &&
          <IconButton onClick={this.handleConfirm}>
             <CheckIcon fontSize= 'small'/>
          </IconButton>
        }
        { editing &&
          <IconButton onClick={this.handleClose}>
             <CloseIcon fontSize= 'small'/>
          </IconButton>
        }
        { !editing && editable &&
          <IconButton onClick={this.handleEdit}>
             <EditIcon fontSize= 'small'/>
          </IconButton>
        }
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={!!errorMessage}
        >
          <MuiAlert severity="error" elevation={6} variant="filled">
            {errorMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(EditableTextField);
