import React, { Component } from 'react';

class Player extends React.Component {
    handleVote = () => {
        this.props.onVote(this.props.nickname)
    }
    renderVotes(){
        if(this.props.votes === undefined){
            
        }
        else if(this.props.votes === 0){
            return <div className='votes'>
                <div className = 'empty-vote'></div>
            </div>
        }
        else if(this.props.votes)
            return <div className='votes'>
                {[...Array(this.props.votes)].map((e,i)=><div className='vote' key={i}></div>)}
            </div>
    }
    nicknamePlaying(){
        return <span 
            onClick={this.handleVote} 
            className="badge bg-primary m-2 nickname">
            {this.props.nickname}
        </span>
    }
    nicknameVoted(){
        return <span  
            className="badge bg-warning m-2 nickname">
            {this.props.nickname}
        </span>
    }
    nicknameEliminated(){
        return <span className="badge bg-danger m-2 nickname">{this.props.nickname}</span>
    }
    renderEliminated(){
        return(
            <div className='player-eliminated'>
                {this.nicknameEliminated()}
            </div>
        );
    }
    renderPlaying(){
        return(
            <div className='player'>
                {this.renderVotes()}
                {this.props.voted? this.nicknameVoted():this.nicknamePlaying()}
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
 
export default Player;