import React, {Component} from 'react'
import { Form,Input, Button, Message } from "semantic-ui-react"
import Campaign from "../ethereum/campaign"
import web3 from '../ethereum/web3';
import Error from './Error';
import Waiting from './Waiting';
import Success from './Success';
import {Link, Router} from '../routes'

class ContributeForm extends Component {
  state = {
    contribution: '',
    errorMessage:'',
    waiting:false,
    redirecting:false,
    disabled: false
  }
 onSubmit = async(event)=>{
  event.preventDefault();
  const deployedInstance = Campaign(this.props.address);

  try{
    this.setState({
      errorMessage:'',
      disabled: true,
      waiting: true
    })
    const accounts = await web3.eth.getAccounts();
    await deployedInstance.methods.addApprovers().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.contribution,'ether')
   })
   this.setState({waiting:false,redirecting:true})
   setTimeout(()=>{
    this.setState({disabled:false,redirecting: false})
    Router.replaceRoute(`/campaigns/${this.props.address}`)
   },2000)
  }catch(err){
    if(err.message)
    this.setState({disabled:false, errorMessage:err.message})
    else
    this.setState({disabled:false, errorMessage: err})
 }
}
 render(){
  return (
    <div style={{marginTop:"30px"}}>
      <h3>Contribute to this Campaign</h3>
    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
            <Input 
            label="ether" 
            labelPosition="right"
            value = {this.state.contribution}
            onChange = {event=> this.setState({contribution: event.target.value})}>  
            </Input>
            <Error errorMessage={this.state.errorMessage} size='tiny'/>
            {!this.state.errorMessage?<Waiting waiting={this.state.waiting} size='tiny'/> : null}
            {!this.state.errorMessage?<Success redirecting={this.state.redirecting} size='tiny'/> : null}
          </Form.Field>
        <Button primary disabled={this.state.disabled}>Contribute!</Button>
    </Form>
    </div>
  )
 }
}

export default ContributeForm