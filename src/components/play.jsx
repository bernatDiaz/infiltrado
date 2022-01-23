import React, { Component } from 'react';
import Player from './player';
import Role from './role';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';
import Timer from './timer';

class Play extends React.Component {
    constructor(props){
        super(props);
    }
    handleTimeout = () => {
        if(!this.props.player_voted){
            getAdapterService().timeout(this.props.game.name, "_abstenido");
        }
        else{
            getAdapterService().timeout(this.props.game.name, this.props.player_voted);
        }
    }
    getVotes = (nickname) => {
        if(!this.props.votes){
            return undefined;
        }
        else if(!this.props.votes[nickname]){
            return 0;
        }
        else{
            return this.props.votes[nickname];
        }
    }
    role(){
        return <Role
        infiltrado = {this.props.infiltrado}
        word={this.props.word}
        />
    }
    timer(time){
        return <Timer
        seconds={time}
        onTimeout={this.handleTimeout}/>
    }
    render() { 
        return (
            <div className='container'>
            </div>);
    }
}
 
export default Play;