import React, {Component} from "react"
import { Layout } from "../../components/Layout"
import { Form, Button, Input, Message} from 'semantic-ui-react'
import factory from "../../ethereum/factory"
import web3 from "../../ethereum/web3"
import { Router } from "../../routes"
import Waiting from "../../components/Waiting"
import Success from "../../components/Success"
import Error from "../../components/Error"

export default class CampaignNew extends Component{
state = {
        minimumContruibution: '',
        errorMessage:'',
        disabled: false,
        waiting: false,
        redirecting: false
}
onSubmit = async(event)=>{
        event.preventDefault();
        try{
            this.setState({
                errorMessage:'',
                disabled: true,
                waiting: true
            })
        const accounts = await web3.eth.getAccounts();
        await factory.methods.addCampaign(this.state.minimumContruibution).send({
            from: accounts[0]
        })
        this.setState({waiting:false,redirecting:true})
        Router.pushRoute("/")
       }catch(err){
        this.setState({disabled: false,errorMessage: err.message})
       }
       this.setState({disabled: false})
}
render(){
     return(
        <Layout>
        <h3>Create Campaign</h3>
         <Form style={{marginTop:'20px'}} size='large' onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field width="6">
           <label>Minimum Contribution(wei)</label>
           <Input 
           label = "wei"
           labelPosition = "right"
           value = {this.state.minimumContruibution}
           onChange={(event)=> this.setState({minimumContruibution: event.target.value})}/>
         </Form.Field>
        <Error errorMessage={this.state.errorMessage} size='tiny'/>
        {!this.state.errorMessage?<Waiting waiting={this.state.waiting} size='tiny'/> : null}
        {!this.state.errorMessage?<Success redirecting={this.state.redirecting} size='tiny'/> : null}
         <Button type='submit' primary disabled={this.state.disabled}>Create</Button>
         </Form>
            </Layout>
        )
    }
}