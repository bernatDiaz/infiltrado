import React, { Component } from 'react';

class Player extends React.Component {
    handleVote = () => {
        this.props.onVote(this.props.nickname)
    }
    renderPlaying(){
        if(this.props.voted){
            return (
                <div className='player'>
                    <span  
                    className="badge bg-warning m-2 nickname">
                    {this.props.nickname}
                    </span>
                    <h3 className='h3'>{this.props.lastWord}</h3>
                </div>);
        }
        else{
            return (
                <div className='player'>
                    <span 
                    onClick={this.handleVote} 
                    className="badge bg-primary m-2 nickname">
                    {this.props.nickname}
                    </span>
                    <h3 className='h3'>{this.props.lastWord}</h3>
                </div>);
        }
    }
    renderEliminated(){
        return(
            <div className='player-eliminated'>
                <span className="badge bg-danger m-2 nickname">{this.props.nickname}</span>
            </div>
        );
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