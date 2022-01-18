import React, { Component } from 'react';
import Start from './start.jsx';
import Join from './join.jsx';
import "./styles.css"
import Create from './create.jsx';
import NotificationSystem from 'react-notification-system';
import Lobby from './lobby.jsx';
import { getAdapterService } from '../services/adapter.tsx';
import { getWSService } from '../services/webSocket';
import Game from './game.tsx';


class App extends React.Component <{}, { [key: string]: any}>{
    notificationSystem: React.RefObject<any>;
    constructor(props: any){
        super(props);
        this.state = {
            screen: SCREEN.START,
            createAvailible: true,
            joinAvailible: true,
        };
    }
    componentDidMount(){
        this.notificationSystem = React.createRef();
        getWSService().addMessageListener("createGame", this.onCreateCode);
        getWSService().addMessageListener("joinGame", this.onJoinCode);
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
                let obj = {name: message.name, password: message.password, host: false};
                this.setState({
                    game: obj,
                    screen: SCREEN.GAME
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
    validName = (name:string) => {
        if(name === ""){
            return {message: 'Name cannot be empty', level: 'error'}
        }
        else{
            return {message: 'Game created successfully', level: 'success'}
        }
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
                let obj = {name: message.name, password: message.password, host:true, mode:"local"};
                this.setState({
                    game: obj,
                    screen: SCREEN.GAME
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
    onModeChange = (value) => {
        const game = {...this.state.game};
        game.mode = value;
        this.setState({
            game,
        })
    }  
    renderStart(){
        return <React.Fragment>
                <Start onJoin={this.handleJoin} onCreate={this.handleCreate}/>
            </React.Fragment>
    }
    renderJoin(){
        return <React.Fragment>
                <Join onSubmit={this.handleJoinCode} active={this.state.joinAvailible}/>
            </React.Fragment>
    }
    renderCreate(){
        return <React.Fragment>
                <Create onSubmit={this.handleCreateCode} active={this.state.createAvailible}/>
            </React.Fragment>
    }
    renderGame(){
        return <React.Fragment>
                <Game 
                notificationSystem={this.notificationSystem} 
                game={this.state.game}
                onModeChange={this.onModeChange}/>
            </React.Fragment>
    }
    renderConditional() { 
        switch(this.state.screen){
            case SCREEN.START:
                return this.renderStart();
            case SCREEN.JOIN:
                return this.renderJoin();
            case SCREEN.CREATE:
                return this.renderCreate();
            case SCREEN.GAME:
                return this.renderGame();
        }
    }
    render(){
        return(
            <div className='screen'>
                <NotificationSystem ref={this.notificationSystem} />
                {this.renderConditional()}
            </div>
        )
    }
}

enum SCREEN {START, JOIN, CREATE, GAME}

export default App;