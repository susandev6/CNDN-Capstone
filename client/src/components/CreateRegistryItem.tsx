import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { createRegistryItem } from '../api/registryItem-api'
import Auth from '../auth/Auth'

interface CreateRegistryitemProps {
  auth: Auth
}

interface CreateRegistryitemState {
  registryItemName: string
  registryItemDescription: string
  registryItemLink: string,
  uploadingItem: boolean
}

export class CreateRegistryitem extends React.PureComponent<
  CreateRegistryitemProps,
  CreateRegistryitemState
> {
  state: CreateRegistryitemState = {
    registryItemName: '',
    registryItemDescription: '',
    registryItemLink: '',
    uploadingItem: false
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

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.registryItemName || !this.state.registryItemDescription || !this.state.registryItemLink) {
        alert('Name, description and link should be provided')
        return
      }

      this.setUploadState(true)
      const registryItem = await createRegistryItem(this.props.auth.getIdToken(), {
        name: this.state.registryItemName,
        description: this.state.registryItemDescription,
        link: this.state.registryItemLink
      })

      console.log('Created Item', registryItem)

      alert('Item was created!')
    } catch (e) {
      alert('Could not create item: ' + e.message)
    } finally {
      this.setUploadState(false)
    }
  }

  setUploadState(uploadingItem: boolean) {
    this.setState({
      uploadingItem
    })
  }

  render() {
    return (
      <div>
        <h1>Create new Registry Item</h1>

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
          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <Button loading={this.state.uploadingItem} type="submit">
        Create
      </Button>
    )
  }
}