import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.css';
import FontAwesome from 'react-fontawesome';

class Card extends React.Component{
    render(){
        const { icon, headerText, children, background } = this.props
        return (
            <div style={[{background}, styles.card]}>
                {icon !== undefined && headerText!== undefined && 
                    <div>
                        <FontAwesome 
                            name = {icon} 
                            size={'2x'}/>
                        <span style={styles.headerText}>{headerText}</span>
                        <hr style={styles.divider}></hr>
                    </div>
                }
                <div>{children}</div>
            </div>
        )
    }
}

const styles = {
    card: {
        padding: '1em',
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)',
        fontFamily: 'GE Inspira Sans,sans-serif',
        minWidth: '24em',
        minHeight: '10em',
    },
    headerText: {
      marginLeft: '0.5em',
      fontWeight: 'bold',
      fontSize: '1.5em',
    }
}

export default Radium(Card)