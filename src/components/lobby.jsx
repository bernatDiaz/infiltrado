import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameName from './gameName';
import Vocabulary from './vocabulary';
import Nicknames from './nicknames';

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
                <input value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <button onClick={this.changeNickname} type="button" className="btn btn-primary">Submit</button>
                <gap></gap>
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
                <gap></gap>
                <button onClick={this.enableEditing} type='button' className='btn btn-primary'>Edit</button>
                {this.props.game.host && !this.props.startPressed && 
                <button onClick={this.props.onStartPlaying} type="button" className='btn btn-primary'>Start</button>}
                <gap></gap>
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
                <gap></gap>
                <input value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <div className='edit-container'>
                    <button onClick={this.changeNickname} type="button" className="btn btn-primary">Change</button>
                    <button onClick={this.disableEditing} type="button" className="btn btn-primary">Cancel</button>
                </div>
                <gap></gap>
                <Vocabulary words={this.props.words} 
                onAddWord={this.props.onAddWord} onRemoveWord={this.props.onRemoveWord}/>
            </div>
        );
    }

    render() { 
        if(this.props.nickname === null){
            return this.renderNoNickname();
        }
        else{
            if(this.state.editing){
                return this.renderEditNickname();
            }
            else{
                return this.renderWithNickname();
            }
        }
    }

    updateInputName(event){
        this.setState({
            inputName: event.target.value
        })
    }
}
 
export default Lobby;