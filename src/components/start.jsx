import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class Start extends React.Component {
    constructor(props){
        super(props);
    }
    render() { 
        return (
        <div className='container'>
            <button onClick={this.props.onJoin} type="button" className="btn btn-primary btn-start">Join</button>
            <button onClick={this.props.onCreate} type="button" className="btn btn-primary btn-start">Create</button>
        </div>);
    }
}
 
export default Start;