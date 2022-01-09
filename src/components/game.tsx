import React, { Component } from 'react';
import Lobby from './lobby.jsx';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';

const MIN_PLAYERS = 2;

class Game extends React.Component {
    constructor(props: any){
        super(props);
        this.state = {
            screen: SCREEN.LOBBY,
            nickname: null,
            nicknames: [],
            words: ["house", "ship", "car"],
            startPressed: false
        };
    }
    componentDidMount(){
        getWSService().addMessageListener("changeNickname", this.onChangeNickname);
        getWSService().addMessageListener("nicknames", this.onPlayerNicknames);
        getWSService().addMessageListener("requestWords", this.onRequestWords);
    }
    waitingForChangeNicknameResponse = () =>{
        this.setState({
            changeNicknameAvailible: false
        })
    }
    stopWaitingForChangeNicknameResponse = () => {
        this.setState({
            changeNicknameAvailible: true
        })
    }
    handleChangeNickname = (name: string) =>{
        if(name === ""){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "Nickname must not be empty",
                level: 'error',
                position: 'tc'
            });
        }
        else if(name === this.state.nickname){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "Nickname has not changed",
                level: 'warning',
                position: 'tc'
            });
        }
        else{
            getAdapterService().changeNickname(name, this.props.game.name);
            this.waitingForChangeNicknameResponse();
        }
    }
    onChangeNickname = (message) => {
        if(message.type){
            if(message.type === "success"){
                this.setState({
                    nickname: message.nickname,
                });
                const notification = this.props.notificationSystem.current;
                notification.addNotification({
                    message: "Nickname successfully changed",
                    level: 'success',
                    position: 'tc'
                });
                this.stopWaitingForChangeNicknameResponse();
            }
            else if(message.type === "error"){
                const notification = this.props.notificationSystem.current;
                notification.addNotification({
                    message: message.message,
                    level: 'error',
                    position: 'tc'
                });
                this.stopWaitingForChangeNicknameResponse();
            }
            else{
                console.log("unknown message type")
            }
        }
        else{
            console.log("missing message type");
        }
    }
    onPlayerNicknames = (message) =>{
        console.log("onPlayerNicknames",message);
        this.setState({
            nicknames: message.otherPlayers
        });
    }
    onRequestWords = (message) => {
        console.log("onRequestWords");
        this.onRequestStartPlaying();
        getAdapterService().sendWords(this.state.words, message.gameID);
    }
    handleAddWord = (word:string) => {
        if(word === ""){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "Word must not be empty",
                level: 'error',
                position: 'tc'
            });
        }
        else{
            if(this.state.words.includes(word)){
                const notification = this.props.notificationSystem.current;
                notification.addNotification({
                    message: "The word is already in the list",
                    level: 'warning',
                    position: 'tc'
                });
            }
            else{
                const words = [...this.state.words];
                words.push(word);
                this.setState({
                    words
                })
                const notification = this.props.notificationSystem.current;
                notification.addNotification({
                    message: word + " added to the list",
                    level: 'success',
                    position: 'tc'
                })
            }
        }
    }
    handleRemoveWord = (word:string) => {
        const words = [...this.state.words];
        let index = words.indexOf(word);
        if(index > -1){
            words.splice(index, 1);
        }
        this.setState({
            words
        })
        const notification = this.props.notificationSystem.current;
        notification.addNotification({
            message: word + " removed from the list",
            level: 'success',
            position: 'tc'
        })
    }
    handleStartPlaying = () => {
        console.log("handleStartPlaying", this.props.game.name);
        if(this.numPlayers() >= MIN_PLAYERS){
            this.setState({
                startPressed: true
            })
            getAdapterService().startPlaying(this.props.game.name);
        }
        else{
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "Not enough players, required "+ MIN_PLAYERS.toString() + "  players at least",
                level: 'error',
                position: 'tc'
            })
        }
    }
    numPlayers = () =>{
        if(this.state.nickname){
            return 1 + this.state.nicknames.length;
        }
        else{
            return this.state.nicknames.length;
        }
    }
    onRequestStartPlaying = () => {
        if(this.props.game.host){
            window.setTimeout(()=>{
                getAdapterService().choseRolesAndWord(this.props.game.name);
            },3000)
        }
    }
    renderLobby(){
        return (
            <Lobby 
            players={this.state.nicknames}
            onChangeNickname={this.handleChangeNickname}
            nickname={this.state.nickname}
            game={this.props.game}
            words={this.state.words}
            onAddWord={this.handleAddWord}
            onRemoveWord={this.handleRemoveWord}
            onStartPlaying={this.handleStartPlaying}
            startPressed={this.state.startPressed}
            />
        )
    }
    render() { 
        switch(this.state.screen){
            case SCREEN.LOBBY:
                return this.renderLobby();
        }
    }
}

enum SCREEN {LOBBY}

export default Game;