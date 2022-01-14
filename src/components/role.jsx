import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


class Role extends Component {
    constructor(props){
        super(props);
        this.state = {
            showRole: false
        }
    }
    roleText(){
        if(this.props.infiltrado){
            return <h3 className="h3">Infiltrado</h3>
        }
        else{
            return <React.Fragment>
                <h3 className="h3">Standard player</h3>
                <h3 className="h3">The word is "{this.props.word}"</h3>
            </React.Fragment>;
        }
    }
    ShowRole = () =>{
        this.setState({
            showRole: true
        })
    }
    HideRole = () =>{
        this.setState({
            showRole: false
        })
    }
    renderRoleNotShowing(){
        return(
            <div className="role-container">
                <button onClick={this.ShowRole} className="btn btn-info">Show Role</button>
            </div>
        );
    } 
    renderRoleShowing(){
        return (
            <div className="role-container">
                <button onClick={this.HideRole} className="btn btn-info">Hide Role</button>
                {this.roleText()}
            </div>
        );
    }
    render() { 
        if(this.state.showRole){
            return this.renderRoleShowing();
        }
        else{
            return this.renderRoleNotShowing();
        }
    }
}
 
export default Role;