import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Create extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            inputName : "",
            inputPassword: "",
        };
    }

    submit = () =>{
        if(this.state.password){
            this.props.onSubmit(this.state.inputName, this.state.inputPassword);
        }
        else{
            this.props.onSubmit(this.state.inputName, null);
        }
    }
    
    showPassword = () =>{
        this.setState({
            password: true
        })
    }

    hidePassword = () => {
        this.setState({
            password: false,
            inputPassword: ""
        })
    }

    renderWithoutPassword(){
        return (
            <div className="container">
                <h5 className="h5">Name your game</h5>
                <input value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <button onClick={this.showPassword} type="button" className="btn btn-primary">Add password</button>
                {this.props.active?
                <button onClick={this.submit} type="button" className="btn btn-primary">Create</button>:
                <button onClick={this.submit} type="button" className="btn btn-primary" disabled>Create</button>}
            </div>
        );
    }

    renderWithPassword(){
        return (
            <div className="container">
                <h5 className="h5">Name your game</h5>
                <input value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
                <h5 className="h5">Create a game password</h5>
                <input type="password" value={this.state.inputPassword} onChange={event => {this.updateInputPassword(event);}}/>
                <button onClick={this.hidePassword} type="button" className="btn btn-danger">Remove password</button>
                {this.props.active?
                <button onClick={this.submit} type="button" className="btn btn-primary">Create</button>:
                <button onClick={this.submit} type="button" className="btn btn-primary" disabled>Create</button>}
            </div>
        );
    }

    render() { 
        if(this.state.password){
            return this.renderWithPassword();
        }
        else{
            return this.renderWithoutPassword();
        }
    }

    updateInputName(event){
        this.setState({
            inputName: event.target.value
        })
    }

    updateInputPassword(event){
        this.setState({
            inputPassword: event.target.value
        })
    }
}
 
export default Create;