import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {  deleteRegistryItem, getRegistryItems, patchRegistryItem } from '../api/registryItem-api'
import Auth from '../auth/Auth'
import { RegistryItem } from '../types/RegistryItem'

interface RegistryItemsProps {
  auth: Auth
  history: History
}

interface RegistryItemsState {
  registryItems: RegistryItem[]
  loadingRegistryItems: boolean
}

export class RegistryItems extends React.PureComponent<RegistryItemsProps, RegistryItemsState> {
  state: RegistryItemsState = {
    registryItems: [],
    loadingRegistryItems: true
  }

  handleCreateRegistryItem = () => {
    this.props.history.push(`/registryitems/create`)
  }

  onEditButtonClick = (itemid: string) => {
    this.props.history.push(`/registryitems/${itemid}/edit`)
  }

  onUploadButtonClick = (itemid: string) => {
    this.props.history.push(`/registryitems/${itemid}/upload`)
  }

  onRegistryItemDelete = async (registryItemId: string) => {
    try {
      await deleteRegistryItem(this.props.auth.getIdToken(), registryItemId)
      this.setState({
        registryItems: this.state.registryItems.filter(item => item.registryItemId != registryItemId)
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  onRegistryItemCheck = async (pos: number) => {
    try {
      const item = this.state.registryItems[pos]
      await patchRegistryItem(this.props.auth.getIdToken(), item.registryItemId, {
        name: item.name,
        description: item.description,
        link:  item.link,
        complete: !item.complete
      })
      this.setState({
        registryItems: update(this.state.registryItems, {
          [pos]: { complete: { $set: !item.complete } }
        })
      })
    } catch {
      alert('Item Updation failed')
    }
  }

  async componentDidMount() {
    try {
      const registryItems = await getRegistryItems(this.props.auth.getIdToken())
      
      this.setState({
        registryItems,
        loadingRegistryItems: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Registry List!</Header>

        <Button
          primary
          size="huge"
          className="add-button"
          onClick={this.handleCreateRegistryItem}
        >
          Add Item to Registry
        </Button>

        <Divider clearing />

         {this.renderRegistryItems()}
      </div>
    )
  }


renderRegistryItems() {
    if (this.state.loadingRegistryItems) {
      return this.renderLoading()
    }

    return this.renderItems()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Items
        </Loader>
      </Grid.Row>
    )
  }

  renderItems() {
    return (
      <Grid padded>
        {this.state.registryItems.map((item, pos) => {
          return (
            <Grid.Row key={item.registryItemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onRegistryItemCheck(pos)}
                  checked={item.complete}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {item.name} 
               </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {item.description}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                <a href={item.link}>{item.link}</a>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onUploadButtonClick(item.registryItemId)}
                >
                  <Icon name="upload" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.registryItemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRegistryItemDelete(item.registryItemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {item.imageUrl && (
                <Image src={item.imageUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

 
}