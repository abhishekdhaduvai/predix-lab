import React, {PropTypes, Component} from 'react';

export default class Marker extends Component {

  render() {
    // console.log(this.props.$click)
    return (
       <div style={MarkerStyles}>
          {this.props.text}
       </div>
    );
  }
}

const K_WIDTH = 10;
const K_HEIGHT = 10;

const MarkerStyles = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,
  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 10,
  fontWeight: 'bold',
  padding: 4
};