import React, { Component } from 'react';
import Lobby from './lobby.jsx';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';
import Play from './play.jsx';
import PlayOnline from './playOnline.jsx';

const MIN_PLAYERS = 2;

class Game extends React.Component {
    constructor(props: any){
        super(props);
        this.state = {
            screen: SCREEN.LOBBY,
            nickname: null,
            nicknames: [],
            words: ["house", "ship", "car"],
            startPressed: false,
            showTimer: true,
        };
    }
    componentDidMount(){
        getWSService().addMessageListener("changeNickname", this.onChangeNickname);
        getWSService().addMessageListener("nicknames", this.onPlayerNicknames);
        getWSService().addMessageListener("requestWords", this.onRequestWords);
        getWSService().addMessageListener("startGame", this.onStartGame);
        getWSService().addMessageListener("lastWords", this.onUpdateLastWords);
        getWSService().addMessageListener("votes", this.onVotes);
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
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
        const reservedKeywords = ["_abstenido", "_nobody"];
        if(name === ""){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "Nickname must not be empty",
                level: 'error',
                position: 'tc'
            });
        }
        else if(reservedKeywords.includes(name)){
            const notification = this.props.notificationSystem.current;
            notification.addNotification({
                message: "That name is reserved",
                level: 'warning',
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
            getAdapterService().startPlaying(this.props.game);
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
    onStartGame = (message) => {
        const players = message.players.filter(player => 
            {
                return player.nickname !== this.state.nickname
            })
        const I = message.players.filter(player => 
            {
                return player.nickname === this.state.nickname
            })[0]
        const game = {...this.state.game};
        game.mode = message.mode;
        this.setState({
            screen: SCREEN.PLAY,
            players,
            eliminated: I.eliminated,
            infiltrado: message.infiltrado,
            word: message.word,
            game,
        })
    }
    onUpdateLastWords = (message) => {
        const players = message.players.filter(player => 
            {
                return player.nickname !== this.state.nickname
            })
        const I = message.players.filter(player => 
            {
                return player.nickname === this.state.nickname
            })[0]
        console.log(I);
        this.setState({
            screen: SCREEN.PLAY,
            players,
            eliminated: I.eliminated,
            lastWord: I.lastWord,
        })
    }
    handleVote = (nickname) => {
        this.setState({
            player_voted: nickname
        })
    }
    onVotes = (message) => {
        const {votes, playerEliminated} = message;
        console.log("votes", votes);
        console.log("playerEliminated", playerEliminated);
        this.setState({
            votes,
        })
        setTimeout(()=>{
            if(this._isMounted){
                this.setState({
                    votes: undefined,
                    showTimer: false,
                })
                const notificationTime = 5;
                if(playerEliminated != "_nobody"){
                    const notificationTime = 5;
                    const notification = this.props.notificationSystem.current;
                    notification.addNotification({
                        message: playerEliminated + " was eliminated",
                        level: 'info',
                        position: 'bc',
                        dismissible: 'none',
                        autoDismiss: notificationTime,
                    })
                }
                else{
                    const notification = this.props.notificationSystem.current;
                    notification.addNotification({
                        message: "Nobody was eliminated",
                        level: 'info',
                        position: 'bc',
                        dismissible: 'none',
                        autoDismiss: notificationTime,
                    })
                }
                setTimeout(() => {
                    if(this._isMounted){
                        if(message.winner != "_nobody"){
                            this.setState({
                                winner: message.winner
                            })
                        }
                        else{
                            console.log("No winner yet");
                            const players = this.state.players;
                            const playersModified = players.map((player) => {
                                return {
                                    nickname: player.nickname,
                                    eliminated: player.eliminated || playerEliminated === player.nickname,
                                    lastWord: "",
                                }
                            });
                            this.setState({
                                players: playersModified,
                                nickname: this.state.nickname,
                                eliminated: this.state.eliminated || playerEliminated === this.state.nickname,
                                lastWord: "",
                                showTimer: true,
                                player_voted: undefined,
                            });
                        }
                    }
                }, notificationTime * 1000)
            }
        },3000);
    }
    handleTimerReset(){
        this.setState({
            resetTimer: false,
        })
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
            onModeChange={this.props.onModeChange}
            />
        )
    }
    renderPlay(){
        return(
            <PlayOnline
            players = {this.state.players}
            nickname = {this.state.nickname}
            eliminated = {this.state.eliminated}
            lastWord = {this.state.lastWord}
            notificationSystem = {this.props.notificationSystem}
            game = {this.props.game}
            infiltrado = {this.state.infiltrado}
            word = {this.state.word}
            votes = {this.state.votes}
            showTimer = {this.state.showTimer}
            handleVote = {this.handleVote}
            player_voted = {this.state.player_voted}
            />
        )
    }
    render() { 
        switch(this.state.screen){
            case SCREEN.LOBBY:
                return this.renderLobby();
            case SCREEN.PLAY:
                return this.renderPlay();
        }
    }
}

enum SCREEN {LOBBY, PLAY}

export default Game;