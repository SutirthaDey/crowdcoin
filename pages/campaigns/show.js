import React, {Component} from 'react'
import { Layout } from '../../components/Layout';
import { Card, Grid, Button } from "semantic-ui-react"
import web3 from '../../ethereum/web3';
import Campaign from "../../ethereum/campaign"
import ContributeForm from '../../components/ContributeForm';
import { Link, Router } from "../../routes"

class CampaignDetails extends Component{

static async getInitialProps(props){
  const address = props.query.address;
  const deployedInstance = Campaign(address);
  const summary = await deployedInstance.methods.getSummary().call();
  return {
    balance:summary[0],
    minimumContribution:summary[1],
    requests: summary[2],
    contributors: summary[3],
    address: address
  };
}

showDetails = ()=>{
  const {balance,minimumContribution,requests,contributors} = this.props;

  const items = [
    {
      header: `${balance} wei`,
      description:
        'Campaign Balance',
    },
    {
      header: `${minimumContribution} wei`,
      description:
        'Minimum Contribution',
    },
    {
      header: `${requests}`,
      description:
        'Requests',
    },
    {
      header: `${contributors}`,
      description:
        'Contributors',
    },
  ]
  return (<Card.Group items={items} />)
}
render(){
  return(
    <Layout>
      <Grid style={{marginTop:'20px'}}>
        <Grid.Row>
        <Grid.Column width={10}>
        <h3>Campaign Details</h3>
        {this.showDetails()}  
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm address={this.props.address}/>
        </Grid.Column>
        </Grid.Row>
        <Grid.Column width={10}>
         <Link route={`/campaigns/${this.props.address}/requests`}>
          <Button primary>View Requests</Button>
         </Link>
        </Grid.Column>
      </Grid>
    </Layout>
  )
}
}
export default CampaignDetails;
