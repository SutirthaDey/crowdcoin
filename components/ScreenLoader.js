import React, {Component} from "react";
import {Dimmer,Loader} from "semantic-ui-react"

class ScreenLoader extends Component{
    render(){
        return(
            <div> 
            <Dimmer active={this.props.fetching} inverted inline="centered">
              <Loader size='large'>{this.props.message}</Loader>
            </Dimmer>
            </div> 
        )
    }
}

ScreenLoader.defaultProps = {
    message : 'fetching data'
}

export default ScreenLoader;