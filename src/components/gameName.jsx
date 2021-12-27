import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class GameName extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        if(this.props.game.password){ 
            return (
                <div className='game-info'>
                    <h1 className='h1'>{this.props.game.name}</h1>
                    <h3 className='h3'>password: {this.props.game.password}</h3>
                </div>
            );
        }
        else{
            return(
                <div className='game-info'>
                    <h1 className='h1'>{this.props.game.name}</h1>
                    <h3 className='h3'>No password</h3>
                </div>
            )
        }
    }
}
 
export default GameName;