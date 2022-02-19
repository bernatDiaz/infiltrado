import React, { Component } from 'react';
import {getWSService} from '../services/webSocket';
import {getAdapterService} from '../services/adapter.tsx';

class Timer extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    componentDidMount(){
        this.startTimer();
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
        let hours_str = hours.toString()
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let minutes_str = minutes.toString();
        if(minutes < 10){
            minutes_str = "0"+minutes_str;
        }
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        let seconds_str = seconds.toString();
        if(seconds < 10){
            seconds_str = "0"+seconds_str;
        }
    
        let obj = {
          "h": hours_str,
          "m": minutes_str,
          "s": seconds_str,
        };
        return obj;
    }
    startTimer = ()  => {
        if (this.props.seconds > 0) {
            this.setState({
                seconds: this.props.seconds,
                time: this.secondsToTime(this.props.seconds),
            })
            this.timer = setInterval(this.countDown, 1000);
        }
    }
    countDown = () => {
        if(this._isMounted){
            // Remove one second, set state so a re-render happens.
            let seconds = this.state.seconds - 1;
            this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
            });
            // Check if we're at zero.
            if (seconds == 0) { 
            clearInterval(this.timer);
            this.props.onTimeout();
            }
        }
        else{
            clearInterval(this.timer);
        }
    }
    render() { 
        return (
        <div className='timer-container'>
            {this.state.time && <h1 className='timer-text'>{this.state.time.m}:{this.state.time.s}</h1>}
        </div>
        );
    }
}
 
export default Timer;