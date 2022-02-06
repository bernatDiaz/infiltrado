import React, { Component } from 'react';
import Play from './play';
import Player from './player';
import { getAdapterService } from '../services/adapter.tsx';

const TIME = 20;

class PlayLocal extends Play {
    constructor(props){
        super(props);
    } 
    startTimeout = () => {
        getAdapterService().startTimeout(this.props.game.name)
    }
    conditionalRenderHost(){
        if(this.props.game.host){
            if(!this.props.timer){
                return <React.Fragment>
                    <button onClick={this.startTimeout} type="button" className='btn btn-primary'>Start</button>
                </React.Fragment> 
            }
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
                    <Player
                    key={player.nickname}
                    nickname={player.nickname}
                    eliminated={player.eliminated}
                    onVote={this.props.handleVote}
                    voted={player.nickname === this.props.player_voted}
                    votes={this.getVotes(player.nickname)}
                    />
                    )}
                </div>
                <Player
                key={this.props.nickname}
                nickname={this.props.nickname}
                eliminated={this.props.eliminated}
                votes={this.getVotes(this.props.nickname)}
                />
                {this.conditionalRenderHost()}
                {this.role()}
            </div>);
    }
}
 
export default PlayLocal;