import React, {Component} from "react";
import {Message, Icon} from "semantic-ui-react"

class Success extends Component{
    render(){
        return(
         <Message icon hidden={!this.props.redirecting} size={this.props.size}>
            <Icon name='check' color="green"/>
            <Message.Content>
            <Message.Header>Success! </Message.Header>
             Redirecting..      <Icon name="circle notched" loading color="green" size='large'/>
            </Message.Content>
         </Message>
        )
    }
}

Success.defaultProps = {
    size : 'small'
}

export default Success;