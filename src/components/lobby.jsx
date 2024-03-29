import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameName from './gameName';
import Vocabulary from './vocabulary';
import Nicknames from './nicknames';
import GameMode from './gameMode';

class Lobby extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputName: "",
            editing: false
        }
    }

    changeNickname = () => {
        this.props.onChangeNickname(this.state.inputName);
        if(this.state.editing){
            this.disableEditing();
        }
    }

    enableEditing = () => {
        this.setState({
            editing: true
        })
    }

    disableEditing = () => {
        this.setState({
            editing: false
        })
    }

    renderNoNickname(){
        return (
            <div className='container'>
                <GameName game={this.props.game}/>
                <Nicknames players={this.props.players}/>
                <h5 className="h5">Enter your nickname</h5>
                <input className='input-small' value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <button onClick={this.changeNickname} type="button" className="btn btn-primary btn-small">Submit</button>
                <Vocabulary words={this.props.words} 
                onAddWord={this.props.onAddWord} onRemoveWord={this.props.onRemoveWord}/>       
            </div>
        );
    }

    renderWithNickname(){
        return (
            <div className='container'>
                <GameName game={this.props.game}/>
                <Nicknames players={this.props.players}/>
                <span className="badge bg-primary m-2 nickname">{this.props.nickname}</span>
                <button onClick={this.enableEditing} type='button' className='btn btn-primary btn-small'>Edit</button>
                {this.props.game.host && !this.props.startPressed && 
                <button onClick={this.props.onStartPlaying} type="button" className='btn btn-primary btn-small'>Start</button>}
                <Vocabulary words={this.props.words} 
                onAddWord={this.props.onAddWord} onRemoveWord={this.props.onRemoveWord}/>
            </div>
        );
    }

    renderEditNickname(){
        return (
            <div className='container'>
                <GameName game={this.props.game}/>
                <Nicknames players={this.props.players}/>
                <span className="badge bg-primary m-2 nickname">{this.props.nickname}</span>
                <input className='input-small' value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <div className='edit-container'>
                    <button onClick={this.changeNickname} type="button" className="btn btn-primary btn-small">Change</button>
                    <button onClick={this.disableEditing} type="button" className="btn btn-primary btn-small">Cancel</button>
                </div>
                <Vocabulary words={this.props.words} 
                onAddWord={this.props.onAddWord} onRemoveWord={this.props.onRemoveWord}/>
            </div>
        );
    }
    conditionalRenderHost(){
        if(this.props.game.host){
            if(!this.props.startPressed){
                return <React.Fragment>
                    <button onClick={this.props.onStartPlaying} type="button" className='btn btn-primary btn-small'>Start</button>
                    <GameMode
                    onModeChange={this.props.onModeChange}
                    gameMode={this.props.game.mode}
                    />
                </React.Fragment> 
            }
        }
    }

    conditionalRenderingNickname(){
        if(this.props.nickname === null){
            return <React.Fragment>
                <h5 className="h5">Enter your nickname</h5>
                <input className='input-small'  value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <button onClick={this.changeNickname} type="button" className="btn btn-primary btn-small">Submit</button>
            </React.Fragment>
        }
        else{
            if(this.state.editing){
                return <React.Fragment>
                    <span className="badge bg-primary m-2 nickname nickname-small">{this.props.nickname}</span>
                    <input className='input-small' value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                    <div className='edit-container'>
                        <button onClick={this.changeNickname} type="button" className="btn btn-primary btn-small">Change</button>
                        <button onClick={this.disableEditing} type="button" className="btn btn-primary btn-small">Cancel</button>
                    </div>
                </React.Fragment>
            }
            else{
                return <React.Fragment>
                    <span className="badge bg-primary m-2 nickname nickname-small">{this.props.nickname}</span>
                    <button onClick={this.enableEditing} type='button' className='btn btn-primary btn-small'>Edit</button>
                </React.Fragment>
            }
        }
    }

    render() { 
        return(
            <div className='container'>
                <GameName game={this.props.game}/>
                <Nicknames players={this.props.players}/>
                {this.conditionalRenderingNickname()}
                {this.conditionalRenderHost()}
                <Vocabulary words={this.props.words} 
                onAddWord={this.props.onAddWord} onRemoveWord={this.props.onRemoveWord}/>       
            </div>
        );
    }

    updateInputName(event){
        this.setState({
            inputName: event.target.value
        })
    }
}
 
export default Lobby;