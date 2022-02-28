import React,{Component} from 'react'
import {Layout} from "../../../components/Layout"
import RequestTable from "../../../components/RequestTable"
import {Grid, Button} from "semantic-ui-react"
import {Link, Router} from "../../../routes"
import campaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3"
import Error from '../../../components/Error'
import Success from '../../../components/Success'
import Waiting from '../../../components/Waiting'

class showRequests extends Component{
_isMounted = false
state = {
  errorMessage: '',
  waiting: false,
  redirecting: false,
  index:''
}
static async getInitialProps(props){
   const address = props.query.address;
   return {address: address}
}

componentDidMount(){
  this._isMounted=true
}

componentWillUnmount(){
  this._isMounted=false
}

onApprove = async(index)=>{
  const {address} = this.props;
  this._isMounted &&  this.setState({errorMessage:'', waiting:true})
  try{
  const deployedInstance = campaign(address);
  let accounts = await web3.eth.getAccounts();
  await deployedInstance.methods.approveRequest(index).send({
     from: accounts[0]
  })
  this._isMounted && this.setState({waiting:false,redirecting:true})
  Router.reload(window.location+`./campaigns/${this.props.address}/requests`)
  }catch(err){
     this._isMounted && this.setState({errorMessage:err.message, waiting:false})
  }
  this._isMounted && this.setState({waiting:false})
}

onFinalize = async(index)=>{
  try{
  this._isMounted && this.setState({errorMessage:'', waiting:true})
  const {address} = this.props;
  const deployedInstance = campaign(address);
  let accounts = await web3.eth.getAccounts();
  await deployedInstance.methods.finalize(index).send({
     from: accounts[0]
  })
  this._isMounted && this.setState({waiting:false,redirecting:true})
  Router.reload(window.location+`./campaigns/${this.props.address}/requests`)
 }catch(err){
  this._isMounted && this.setState({errorMessage:err.message, waiting:false})
 }
 this._isMounted && this.setState({waiting:false})
}

setRedirecting = ()=> this.setState({redirecting:false})

componentWillUnmount(){
  this.setState({redirecting:false})
}

render(){
   return(
   <Layout>
     <Grid>
      <Grid.Row>
       <Grid.Column width={14}>
        {this.state.errorMessage  ? <Error errorMessage={this.state.errorMessage}/> :  null}
        {!this.state.errorMessage ? <Waiting waiting={this.state.waiting}/> : null}
        {!this.state.errorMessage ? <Success redirecting={this.state.redirecting}/> : null}
       </Grid.Column>
      </Grid.Row>
    </Grid>
    <Grid>
     <Grid.Row style={{marginTop:"20px"}}>
      <Grid.Column width={8}>
       <h3>Requests</h3>
       </Grid.Column>
       <Grid.Column width={8} >
       <Link route={`/campaigns/${this.props.address}/requests/create`}>
       <Button primary floated='right'>Create Request</Button>
       </Link>
       </Grid.Column>
      </Grid.Row>
    <Grid.Row>
    <Grid.Column width={14}>
      <RequestTable address={this.props.address} onApprove={this.onApprove} onFinalize={this.onFinalize} setRedirecting={this.setRedirecting} waiting={this.state.waiting} redirecting={this.state.redirecting}/>
    </Grid.Column>
    </Grid.Row>
    </Grid>
   </Layout>
   )
}
}
export default showRequests;

