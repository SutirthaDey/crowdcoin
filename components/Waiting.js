import React, {Component} from "react";
import {Message, Icon} from "semantic-ui-react"

class Waiting extends Component{
    render(){
        return(
         <Message icon hidden={!this.props.waiting} size={this.props.size}>
            <Icon name='circle notched' loading color="orange"/>
            <Message.Content>
            <Message.Header>Transaction Processing</Message.Header>
             Please wait...
            </Message.Content>
         </Message>
        )
    }
}

Waiting.defaultProps = {
    size : 'small'
}

export default Waiting;