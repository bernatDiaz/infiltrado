import React, { Component } from 'react';
import { confirm } from 'react-confirm-box';

class Word extends React.Component {
    constructor(props){
        super(props);
    }
    triggerRemove = async () => {
        const result = await confirm("Are you sure you wanna remove " + this.props.word + "?");
        if (result) {
            this.props.onRemove(this.props.word)
        }

    }
    render() { 
        if(this.props.onRemove != null){
            return this.renderRemove();
        }
        else{
            return this.renderNoRemove();
        }
    }
    renderRemove(){
        return (
            <div>
                <h5 onClick={this.triggerRemove}>{this.props.word}</h5>
            </div>
            );
    }
    renderNoRemove(){
        return (
            <div>
                <h5>{this.props.word}</h5>
            </div>
            );
    }
}
 
export default Word;