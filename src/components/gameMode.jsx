import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class GameMode extends Component {
    onModeChange = (e) =>{
        this.props.onModeChange(e.currentTarget.value)
    }
    render() { 
        return (
        <div className="chose-game-mode-container">
            <div className="chose-game-mode-element">
                <input
                    type="radio"
                    name="local"
                    value="local"
                    checked={this.props.gameMode === "local"}
                    onChange={this.onModeChange}
                />
                <h4 className="h4">Local</h4>
            </div>
            <div className="chose-game-mode-element">
                <input
                    type="radio"
                    name="online"
                    value="online"
                    checked={this.props.gameMode === "online"}
                    onChange={this.onModeChange}
                />
                <h4 className="h4">Online</h4>
            </div>
        </div>);
    }
}
 
export default GameMode;