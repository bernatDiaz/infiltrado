import React, { Component } from 'react';
import Player from './player';
import Role from './role';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';
import Timer from './timer';
import Play from './play';
import PlayerOnline from './playerOnline';

const TIME = 90;

class PlayOnline extends Play {
    constructor(props){
        super(props);
        this.state = {
            inputWord: "",
        }
    }
    componentDidMount(){
        
    }
    sendWord = () => {
        if(this.props.lastWord){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "You already said a word this round",
                level: 'error',
                position: 'tc'
            });
        }
        else{
            getAdapterService().sayWord(this.state.inputWord, this.props.game.name)
            this.setState({
                inputWord: "",
            })
        }
    }
    render() { 
        return (
            <div className='container'>
                {this.abandon()}
                {this.props.timer &&
                this.timer(TIME)}
                <div className='players-grid'>
                    {this.props.players.map(player => 
                    <PlayerOnline
                    key={player.nickname}
                    nickname={player.nickname}
                    lastWord={player.lastWord}
                    eliminated={player.eliminated}
                    onVote={this.props.handleVote}
                    voted={player.nickname === this.props.player_voted}
                    votes={this.getVotes(player.nickname)}
                    />
                    )}
                </div>
                <PlayerOnline
                key={this.props.nickname}
                nickname={this.props.nickname}
                lastWord={this.props.lastWord}
                eliminated={this.props.eliminated}
                votes={this.getVotes(this.props.nickname)}
                />
                {!this.props.lastWord && this.props.timer &&
                <div className="say-word-input">
                <input value={this.state.inputWord} onChange={event => {this.updateInput(event);}}/>
                <button onClick={this.sendWord} type="button" className="btn btn-primary">Send</button>
                </div>}
                {this.role()}
            </div>);
    }
    updateInput(event){
        this.setState({
            inputWord: event.target.value
        })
    }
}
 
export default PlayOnline;