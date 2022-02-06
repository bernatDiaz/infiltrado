import React, { Component } from 'react';
import Player from './player';
import Role from './role';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';
import Timer from './timer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
    handleAbandon = () => {
        confirmAlert({
            title: 'Abandon game',
            message: 'Are you sure you want to abandon the game?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => getAdapterService().abandon(this.props.game.name)
              },
              {
                label: 'No',
              }
            ]
        });
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
    abandon(){
        return <button onClick={this.handleAbandon} 
        type="button" className="btn btn-danger btn-abandon">
            Abandon
            </button>
    }
    render() { 
        return (
            <div className='container'>
            </div>);
    }
}
 
export default Play;