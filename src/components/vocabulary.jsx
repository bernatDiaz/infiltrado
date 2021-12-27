import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Word from './word';


class Vocabulary extends React.Component {
    constructor(props){
        super(props);
        this.state={
            inputWord : ""
        }
    }
    addWord = () => {
        this.props.onAddWord(this.state.inputWord);
        this.setState({
            inputWord: ""
        })
    }

    render() { 
        return (
            <div className='container'>
                <div className='vocabulary-background'>
                    <div className='vocabulary-grid'>
                        {this.props.words.map(word => <Word key={word} word={word} onRemove={this.props.onRemoveWord}/>)}
                    </div>
                </div>
                <input value={this.state.inputWord} onChange={event => {this.updateInputWord(event);}}/>
                <button onClick={this.addWord} type="button" className="btn btn-primary">Add</button>
            </div>
            );
    }
    updateInputWord(event){
        this.setState({
            inputWord: event.target.value
        })
    }
}
 
export default Vocabulary;