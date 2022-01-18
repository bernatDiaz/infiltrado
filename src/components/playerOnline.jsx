import React, { Component } from 'react';
import Player from './player';


class PlayerOnline extends Player {
    lastWord(){
        return <h3 className='h3'>{this.props.lastWord}</h3>
    }
    renderPlaying(){
        return(
            <div className='player'>
                {this.renderVotes()}
                {this.props.voted? this.nicknameVoted():this.nicknamePlaying()}
                {this.lastWord()}
            </div>);
    }
    render() { 
        if(this.props.eliminated){
            return this.renderEliminated();
        }
        else{
            return this.renderPlaying();
        }
    }
}
 
export default PlayerOnline;