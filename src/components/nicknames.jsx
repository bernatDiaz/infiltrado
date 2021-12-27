import React, { Component } from 'react';


class Nicknames extends React.Component {
    constructor(props){
        super(props);
    }
    render() { 
        return (
            <div className='nicknames-grid'>
                {this.props.players.map(player => <span key={player} 
                className="badge bg-primary m-2 nickname"> {player}</span>)}
            </div>
        );
    }
}
 
export default Nicknames;