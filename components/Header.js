import React, { Component } from 'react'
import { Header, Menu } from 'semantic-ui-react'
import { Link,Router } from "../routes"

export default class MenuExampleMenus extends Component {
  state = {}

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    if(name === '+')
    Router.pushRoute('/campaigns/new');
    else
    Router.pushRoute('/');
}

  render() {
    const { activeItem } = this.state

    return (
      <Menu  style={{marginTop: '10px'}}>
        <Menu.Item
          name='CrowdCoins'
          active={activeItem === 'CrowdCoins'}
          onClick={this.handleItemClick}>
          CrowdCoins
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item
            name='Campaigns'
            active={activeItem === 'Campaigns'}
            onClick={this.handleItemClick}
          >
            Campaigns
          </Menu.Item>

          <Menu.Item
            name='+'
            active={activeItem === '+'}
            onClick={this.handleItemClick}
          >
            +
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}