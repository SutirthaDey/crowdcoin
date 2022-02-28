import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Layout } from '../components/Layout';
import factory from "../ethereum/factory"
import { Link,Router } from "../routes"

export default class MenuExampleMenus extends Component{

  static async getInitialProps(){
    const campaigns = await factory.methods.getCampaigns().call();

    return {campaigns};
  }

  viewCampaigns() {
    return (
      <Card.Group style={{marginTop: '10px'}}>
        {this.props.campaigns.map((address,index)=> {
          return(
             <Card fluid color='green' key={index}>
              <Card.Content>
               <Card.Header>{address}</Card.Header>
               <Card.Description><Link route={`/campaigns/${address}`}><a>View Campaign</a></Link></Card.Description>
             </Card.Content>
            </Card>
           )
        })}
      </Card.Group>
      )
    }
  render() {
    return (
      <Layout>
        <Link route="campaigns/new">
        <Button primary floated= "right" style={{marginTop: '10px'}}>
          Create Campaign
        </Button>
        </Link>
          {this.viewCampaigns()}
      </Layout>
    )
  }
}