import React from 'react';

const styles = {
  message:{
    color: 'red'
  },
  list:{
    marginTop: '10px'
  }
}

/* Component for showing a list
*  of error messages on the bottom
*  of the LoginBox
*/
export default class ErrorMessages extends React.Component {
  render() {
    return (
      <ul style={styles.list}>
      { this.props.errors.map((error, index) =>
        <li key={index} style={styles.message}>{ error }</li>
      )}
    </ul>);
  }
}
