import React, { Component } from 'react';
import Start from './start.jsx';
import Join from './join.jsx';
import "./styles.css"
import Create from './create.jsx';
import NotificationSystem from 'react-notification-system';
import Lobby from './lobby.jsx';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';


class App extends React.Component <{}, { [key: string]: any}>{
    notificationSystem: React.RefObject<any>;
    constructor(props: any){
        super(props);
        this.state = {
            screen: SCREEN.START,
            createAvailible: true,
            joinAvailible: true,
            nickname: null,
            nicknames: [],
            words: ["house", "ship", "car"]
        };
    }
    componentDidMount(){
        this.notificationSystem = React.createRef();
        getWSService().addMessageListener("createGame", this.onCreateCode);
        getWSService().addMessageListener("joinGame", this.onJoinCode);
        getWSService().addMessageListener("changeNickname", this.onChangeNickname);
        getWSService().addMessageListener("nicknames", this.onPlayerNicknames);
    }
    handleJoin = () => {
        this.setState({
            screen: SCREEN.JOIN
        })
    }
    handleCreate = () => {
        this.setState({
            screen: SCREEN.CREATE
        })
    }
    handleJoinCode = (name:string, password:string | null) =>{
        let response;
        if((response = this.validName(name)).level !== 'success'){
            const notification = this.notificationSystem.current;
            notification.addNotification({
                message: response.message,
                level: response.level,
                position: 'tc'
            });
        }
        else{
            getAdapterService().joinGame(name, password);
            this.waitingForJoinResponse();
        }
    }
    waitingForJoinResponse = () =>{
        this.setState({
            joinAvailible: false
        })
    }
    stopWaitingForJoinResponse = () => {
        this.setState({
            joinAvailible: true
        })
    }
    onJoinCode = (message) => {
        if(message.type){
            if(message.type === "success"){
                let obj = {name: message.name, password: message.password};
                this.setState({
                    game: obj,
                    screen: SCREEN.LOBBY
                });
                const notification = this.notificationSystem.current;
                notification.addNotification({
                    message: "You successfully joined the game",
                    level: 'success',
                    position: 'tc'
                });
                this.stopWaitingForJoinResponse();
            }
            else if(message.type === "error"){
                const notification = this.notificationSystem.current;
                notification.addNotification({
                    message: message.message,
                    level: 'error',
                    position: 'tc'
                });
                this.stopWaitingForJoinResponse();
            }
            else{
                console.log("unknown message type")
            }
        }
        else{
            console.log("missing message type");
        }
    }
    login(name : string, password: string){
        return {message:'', level: 'success'};
        return {message:'Incorrect password', level: 'error'}
    }
    handleCreateCode = (name: string, password: string | null) => {
        let response;
        if((response = this.validName(name)).level !== 'success'){
            const notification = this.notificationSystem.current;
            notification.addNotification({
                message: response.message,
                level: response.level,
                position: 'tc'
            });
        }
        else{
            getAdapterService().createGame(name, password);
            this.waitingForCreateResponse();
        }
    }
    waitingForCreateResponse = () =>{
        this.setState({
            createAvailible: false
        })
    }
    stopWaitingForCreateResponse = () => {
        this.setState({
            createAvailible: true
        })
    }
    onCreateCode = (message) => {
        if(message.type){
            if(message.type === "success"){
                let obj = {name: message.name, password: message.password};
                this.setState({
                    game: obj,
                    screen: SCREEN.LOBBY
                });
                const notification = this.notificationSystem.current;
                notification.addNotification({
                    message: "Game successfully created",
                    level: 'success',
                    position: 'tc'
                });
                this.stopWaitingForCreateResponse();
            }
            else if(message.type === "error"){
                const notification = this.notificationSystem.current;
                notification.addNotification({
                    message: message.message,
                    level: 'error',
                    position: 'tc'
                });
                this.stopWaitingForCreateResponse();
            }
            else{
                console.log("unknown message type")
            }
        }
        else{
            console.log("missing message type");
        }
    }
    validName(name:string){
        if(name === ""){
            return {message: 'Name must not be empty', level: 'error'};
        }
        return {message:'', level: 'success'};
    }
    nameAlreadyExists(name: string){
        return false;
    }
    handleChangeNickname = (name: string) =>{
        if(name === ""){
            const notification = this.notificationSystem.current;
            notification.addNotification({
                message: "Nickname must not be empty",
                level: 'error',
                position: 'tc'
            });
        }
        else if(name === this.state.nickname){
            const notification = this.notificationSystem.current;
            notification.addNotification({
                message: "Nickname has not changed",
                level: 'warning',
                position: 'tc'
            });
        }
        else{
            getAdapterService().changeNickname(name, this.state.game.name);
            this.waitingForChangeNicknameResponse();
        }
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
    onChangeNickname = (message) => {
        if(message.type){
            if(message.type === "success"){
                this.setState({
                    nickname: message.nickname,
                });
                const notification = this.notificationSystem.current;
                notification.addNotification({
                    message: "Nickname successfully changed",
                    level: 'success',
                    position: 'tc'
                });
                this.stopWaitingForChangeNicknameResponse();
            }
            else if(message.type === "error"){
                const notification = this.notificationSystem.current;
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
    handleAddWord = (word:string) => {
        if(word === ""){
            const notification = this.notificationSystem.current;
            notification.addNotification({
                message: "Word must not be empty",
                level: 'error',
                position: 'tc'
            });
        }
        else{
            if(this.state.words.includes(word)){
                const notification = this.notificationSystem.current;
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
                const notification = this.notificationSystem.current;
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
        const notification = this.notificationSystem.current;
        notification.addNotification({
            message: word + " removed from the list",
            level: 'success',
            position: 'tc'
        })
    }
    renderStart(){
        return (
            <div className='screen'>
                <NotificationSystem ref={this.notificationSystem} />
                <Start onJoin={this.handleJoin} onCreate={this.handleCreate}/>
            </div>
            );
    }
    renderJoin(){
        return (
            <div className='screen'>
                <NotificationSystem ref={this.notificationSystem} />
                <Join onSubmit={this.handleJoinCode} active={this.state.joinAvailible}/>
            </div>
            );
    }
    renderCreate(){
        return(
            <div className='screen'>
                <NotificationSystem ref={this.notificationSystem} />
                <Create onSubmit={this.handleCreateCode} active={this.state.createAvailible}/>
            </div>
        )
    }
    renderLobby(){
        return (
            <div className='screen'>
                <NotificationSystem ref={this.notificationSystem} />
                <Lobby 
                players={this.state.nicknames}
                onChangeNickname={this.handleChangeNickname}
                nickname={this.state.nickname}
                game={this.state.game}
                words={this.state.words}
                onAddWord={this.handleAddWord}
                onRemoveWord={this.handleRemoveWord}
                />
            </div>
        )
    }
    render() { 
        switch(this.state.screen){
            case SCREEN.START:
                return this.renderStart();
            case SCREEN.JOIN:
                return this.renderJoin();
            case SCREEN.CREATE:
                return this.renderCreate();
            case SCREEN.LOBBY:
                return this.renderLobby();
        }
    }
}

enum SCREEN {START, JOIN, CREATE, LOBBY}

export default App;