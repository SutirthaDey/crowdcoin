import React, {Component} from "react";
import {Message, Icon} from "semantic-ui-react"

class Waiting extends Component{
    render(){
        return(
         <Message negative error size={this.props.size} Icon>
            <Message.Header><Icon name='exclamation triangle' color="red"/>Ops!</Message.Header>
            <p>{this.props.errorMessage}</p>
         </Message>
        )
    }
}

Error.defaultProps = {
    size : 'small'
}

export default Waiting;