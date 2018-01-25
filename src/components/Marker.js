import React, {PropTypes, Component} from 'react';
import FaAutomobile from 'react-icons/lib/fa/automobile';

export default class Marker extends Component {

  render() {
    return (
      <div style={{color:'red'}}>
        <FaAutomobile size={25}/>
      </div>
    );
  }
}