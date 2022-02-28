import React, {Component} from "react";
import { Layout } from "../../../../components/Layout";
import campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import {Router} from "../../../../routes"
import CreateRequest from "../../../../components/CreateRequest"

class CreateNew extends Component{
state = {
     description:'',
     recipient:'',
     amount:'',
     disable:false,
     errorMessage:'',
     waiting:false,
     redirecting:false,
}

static async getInitialProps(props){
     const address = props.query.address;
     return {address: address}
}

onSubmit = async() => {
     const address = this.props.address;
     const {description,recipient,amount} = this.state;

     this.setState({disable:true, errorMessage:''})
     try{
     if(description.length<=0)
     throw "please enter a description!"
     const deployedInstance = campaign(address);
     const accounts = await web3.eth.getAccounts();
     this.setState({waiting:true})
     await deployedInstance.methods.createRequest(description.toString(),recipient.toString(),amount.toString()).send({
          from: accounts[0]
     })
     this.setState({waiting:false})
     this.setState({redirecting:true})
     Router.pushRoute(`/campaigns/${address}/requests`)
   }catch(err){
        if(err.message)
        this.setState({disable:false, errorMessage:err.message})
        else
        this.setState({disable:false, errorMessage: err})
   }
}

setInput = (key,value)=> {
     this.setState({[key]:[value] })
}

render(){
    return(
        <Layout>
             <CreateRequest 
             onSubmit={this.onSubmit}
             address = {this.props.address}
             description = {this.state.description}
             recipient = {this.props.recipient}
             amount = {this.props.amount}
             disable = {this.state.disable}
             errorMessage = {this.state.errorMessage}
             waiting = {this.state.waiting}
             redirecting = {this.state.redirecting}
             setInput= {this.setInput}/>
        </Layout>
    )
}
}

export default CreateNew;