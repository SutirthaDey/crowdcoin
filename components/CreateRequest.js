import React, {Component} from 'react'
import Waiting from "./Waiting";
import Success from "./Success";
import Error from './Error';
import { Button, Form, Grid, Message, Input, Icon } from 'semantic-ui-react'

class CreateRequest extends Component{
render(){
    return(
        <Grid>
        <Grid.Column width={10}>
         <Form onSubmit={this.props.onSubmit} error={!!this.props.errorMessage}>
            <Form.Field>
                 <label>Description</label>
                 <input
                 placeholder='Description'
                 value = {this.props.description}
                 onChange={(event)=>this.props.setInput('description',event.target.value)} 
                 />
            </Form.Field>
            <Form.Field>
                 <label>Recipient Address</label>
                 <input placeholder='Address'
                 value = {this.props.recipient}
                 onChange={(event)=>this.props.setInput('recipient',event.target.value)}  
                />
            </Form.Field>
            <Form.Field>
                 <label>Amount</label>
                 <Input
                 label="wei"
                 labelPosition='right'
                 placeholder='Amount'
                 value = {this.props.amount}
                 onChange={(event)=>this.props.setInput('amount',event.target.value)} 
                 />
            </Form.Field>
            <Error errorMessage={this.props.errorMessage}/>
            {!this.props.errorMessage?<Waiting waiting={this.props.waiting}/> : null}
            {!this.props.errorMessage?<Success redirecting={this.props.redirecting}/> : null}
            <Button type='submit' primary disabled={this.props.disable}>Create</Button>
         </Form>
         </Grid.Column>
        </Grid>
    )
 }
}

export default CreateRequest;