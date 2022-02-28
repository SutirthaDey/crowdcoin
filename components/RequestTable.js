import React,{Component} from "react"
import { Table, Button } from "semantic-ui-react"
import campaign from "../ethereum/campaign"
import  ScreenLoader  from "../components/ScreenLoader"
import web3 from "../ethereum/web3"
import {Router} from "../routes"

class RequestTable extends Component{
_isMounted = false
state ={
    vote:[],
    requestList:[],
    totalApprovers:'',
    approvalCounts:[],
    vote:[],
    fetching: false,
    prevAccount:''
}
getRequestsAndVotes = async()=>{
  const address = this.props.address;
  const deployedInstance = campaign(address);
  const requestLength = await deployedInstance.methods.getRequestLength().call();
  const totalApprovers = await deployedInstance.methods.totalApprovers().call();
  let requestList = [];
  let approvalCounts = [];
  let accounts = await web3.eth.getAccounts();
  let vote = [];
  for(let i=0;i<requestLength;i++){
      const request = await deployedInstance.methods.requests(i).call({from: accounts[0]}); // calls did vote from active account
      requestList.push(request);
      approvalCounts.push(request.approvalCounts)
      const eachVote = await deployedInstance.methods.didVote(i).call({from: accounts[0]})
      vote.push(eachVote);
  }
  this.setState({requestList:requestList,totalApprovers:totalApprovers, approvalCounts: approvalCounts, vote:vote}) 
}
async componentDidMount(){
 this._isMounted = true;
 this.setState({fetching: true})
 await this.getRequestsAndVotes();
 this.setState({fetching: false})
}

componentWillUnmount(){
  this._isMounted = false;
}

componentDidUpdate(){
  this._isMounted && window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload()
  })
}

didVoted = (index)=> this.state.vote[index] ? true : false 

render(){
    return(
    <>
    <Table celled textAlign="center">
     <Table.Header>
      <Table.Row>
      <Table.HeaderCell>ID</Table.HeaderCell>
      <Table.HeaderCell>Description</Table.HeaderCell>
      <Table.HeaderCell>Amount</Table.HeaderCell>
      <Table.HeaderCell>Recipient</Table.HeaderCell>
      <Table.HeaderCell>Approvals-Count</Table.HeaderCell>
      <Table.HeaderCell>Approve</Table.HeaderCell>
      <Table.HeaderCell>Finalize</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {this.state.requestList.map((request,index) => {
        return(
       <Table.Row key={index}>
        <Table.Cell>{index}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{request.value}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>{this.state.approvalCounts[index]}/{this.state.totalApprovers}</Table.Cell>
        <Table.Cell>
          <Button onClick={()=>this.props.onApprove(index)} inverted color="green"
           disabled={this.didVoted(index) || request.complete || this.props.waiting || this.props.redirecting}
           >
          {request.complete ? "Approved" : "Approve"}
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button onClick={()=>this.props.onFinalize(index)} inverted color="green"
          disabled={request.complete || this.props.waiting || this.props.redirecting}
          >
          {request.complete ? "Done" : "Finalize"}
          </Button>
        </Table.Cell>
       </Table.Row>
        )
     })
    }
    </Table.Body>
    </Table>
    <ScreenLoader fetching = {this.state.fetching}/>
   </>
    )
 }
}

export default RequestTable;
