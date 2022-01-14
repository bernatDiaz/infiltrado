import React, { Component } from 'react';
import Player from './player';
import Role from './role';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';

class Play extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputWord: "",
        }
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
    handleVote = (nickname) => {
        this.setState({
            player_voted: nickname
        })
    }
    renderInput = () => {
        return (
            <div className='container'>
                <div className='players-grid'>
                    {this.props.players.map(player => 
                    <Player
                    key={player.nickname}
                    nickname={player.nickname}
                    lastWord={player.lastWord}
                    eliminated={player.eliminated}
                    onVote={this.handleVote}
                    voted={player.nickname === this.state.player_voted}
                    />
                    )}
                </div>
                <Player
                key={this.props.nickname}
                nickname={this.props.nickname}
                lastWord={this.props.lastWord}
                eliminated={this.props.eliminated}
                />
                <input value={this.state.inputWord} onChange={event => {this.updateInput(event);}}/>
                <button onClick={this.sendWord} type="button" className="btn btn-primary">Send</button>
                <Role
                infiltrado = {this.props.infiltrado}
                word={this.props.word}
                />        
            </div>);
    }
    renderNoInput = () => {
        return (
            <div className='container'>
                <div className='players-grid'>
                    {this.props.players.map(player => 
                    <Player
                    key={player.nickname}
                    nickname={player.nickname}
                    lastWord={player.lastWord}
                    eliminated={player.eliminated}
                    />
                    )}
                </div>
                <Player
                key={this.props.nickname}
                nickname={this.props.nickname}
                lastWord={this.props.lastWord}
                eliminated={this.props.eliminated}
                />
                <Role
                infiltrado = {this.props.infiltrado}
                word={this.props.word}
                />
            </div>);
    }
    render() { 
        if(!this.props.lastWord){
            return this.renderInput();
        }
        else{
            return this.renderNoInput();
        }
    }
    updateInput(event){
        this.setState({
            inputWord: event.target.value
        })
    }
}
 
export default Play;