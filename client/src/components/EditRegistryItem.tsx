import * as React from 'react'
import { Form, Button, Checkbox, Grid, Loader } from 'semantic-ui-react'
import { patchRegistryItem, getRegistryItemById } from '../api/registryItem-api'
import Auth from '../auth/Auth'
import { CheckBox } from 'react-native';

interface EditRegistryItemProps {
    match: {
        params: {
          registryItemId: string
        }
      }
      auth: Auth
}

interface EditRegistryItemState {
  registryItemName: string
  registryItemDescription: string
  registryItemLink?: string
  complete: boolean
  loadingItem: boolean
}

export class EditRegistryItem extends React.PureComponent<
  EditRegistryItemProps,
  EditRegistryItemState
> {
  state: EditRegistryItemState = {
    registryItemName: '',
    registryItemDescription: '',
    registryItemLink: '',
    complete: false,
    loadingItem: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ registryItemName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ registryItemDescription: event.target.value })
  }

  handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({registryItemLink: event.target.value})
  }

  handleCompleteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({complete: event.target.checked })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.registryItemName || !this.state.registryItemDescription || !this.state.registryItemLink) {
        alert('Name, description and link should be provided')
        return
      }

    
      const registryItem = await patchRegistryItem(this.props.auth.getIdToken(), this.props.match.params.registryItemId,{
        name: this.state.registryItemName,
        description: this.state.registryItemDescription,
        link: this.state.registryItemLink,
        complete: this.state.complete
      })

      console.log('Updated Item', registryItem)

      alert('Item was Updated!')
    } catch (e) {
      alert('Could not update item: ' + e.message)
    } finally {
      
    }
  }

  async componentDidMount() {
    try {
      const registryItem = await getRegistryItemById(this.props.auth.getIdToken(), this.props.match.params.registryItemId)
      
      this.setState({
        registryItemName: registryItem.name,
        registryItemDescription: registryItem.description,
        registryItemLink: registryItem.link,
        complete: registryItem.complete,
        loadingItem: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${e.message}`)
    }
  }

  renderRegistryItem() {
    if (this.state.loadingItem) {
        return this.renderLoading()
      }
  
      return this.renderItems()
    }
  
    renderLoading() {
        return (
          <Grid.Row>
            <Loader indeterminate active inline="centered">
              Loading Item
            </Loader>
          </Grid.Row>
        )
      }
    
      renderButton() {
        return (
          <Button  type="submit">
            Update
          </Button>
        )
      }

      renderItems() {
        return (
            <div>
              <h1>Update Registry Item</h1>
      
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>Name</label>
                  <input
                    placeholder="Registry Item name"
                    value={this.state.registryItemName}
                    onChange={this.handleNameChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Description</label>
                  <input
                    placeholder="Registry Item description"
                    value={this.state.registryItemDescription}
                    onChange={this.handleDescriptionChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Link</label>
                  <input
                    placeholder="Registry Item link"
                    value={this.state.registryItemLink}
                    onChange={this.handleLinkChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>IsComplete</label>
                  <input
                    type="checkbox"
                    checked={this.state.complete}
                    onChange={this.handleLinkChange}
                  />
                </Form.Field>
                {this.renderButton()}
              </Form>
            </div>
          )

      }


  render() {

    return (
        <div>
            {this.renderRegistryItem()}
       </div>
    )
    
  }


}