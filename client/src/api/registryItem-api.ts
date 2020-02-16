import { apiEndpoint } from '../config';
import { RegistryItem } from '../types/RegistryItem';
import { CreateRegistryItemRequest } from '../types/CreateRegistryItemRequest';
import Axios from 'axios'
import { UpdateRegistryItemRequest } from '../types/UpdateRegistryItemRequest';

export async function getRegistryItems(idToken: string): Promise<RegistryItem[]> {
  console.log('Fetching Registry Items')

  const response = await Axios.get(`${apiEndpoint}/registryitems`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Registry Items:', response.data)
  return response.data.items
}

export async function createRegistryItem(
  idToken: string,
  newItem: CreateRegistryItemRequest
): Promise<RegistryItem> {
  const response = await Axios.post(`${apiEndpoint}/registryitems`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRegistryItem(
  idToken: string,
  itemId: string,
  updatedItem: UpdateRegistryItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/registryitems/${itemId}`, JSON.stringify(updatedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRegistryItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/registryitems/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/registryitems/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function getRegistryItemById(idToken: string, itemId: string): Promise<RegistryItem> {
  console.log('Fetching Registry Item for id: ', itemId);

  const response = await Axios.get(`${apiEndpoint}/registryitems/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Registry Item:', response.data)
  return response.data.item
}
