import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Join extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            inputName : "",
            inputPassword: ""
        };
    }

    submit = () => {
        this.props.onSubmit(this.state.inputName, this.state.inputPassword);
    }

    render() { 
        return (
        <div className="container">
            <h5 className="h5">Enter the game name</h5>
            <input value={this.state.inputName} onChange={event => {this.updateInputName(event);}}/>
            <h5 className="h5">Enter the game password (if any)</h5>
            <input type="password" value={this.state.inputPassword} onChange={event => {this.updateInputPassword(event);}}/>
            {this.props.active?
            <button onClick={this.submit} type="button" className="btn btn-primary">Submit</button>:
            <button onClick={this.submit} type="button" className="btn btn-primary" disabled>Submit</button>}
        </div>
        );
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
 
export default Join;