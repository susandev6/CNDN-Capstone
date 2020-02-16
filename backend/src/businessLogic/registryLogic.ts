import * as uuid from 'uuid'
import { RegistryAccess } from '../dataLayer/registryAccess'
import { CreateRegistryItemRequest } from '../requests/CreateRegistryItemRequest'
import { UpdateRegistryItemRequest } from '../requests/UpdateRegistryItemRequest'
import { RegistryItem } from '../models/RegistryItem'

const bucketName = process.env.S3_BUCKET
const registryAccess = new RegistryAccess()

export async function createRegistryItem(
    newRegistryItem: CreateRegistryItemRequest,
    userId: string): Promise<RegistryItem> {
    const itemId = uuid.v4()

    const item = {
        registryItemId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        complete: false,
        ...newRegistryItem
    }

    return await registryAccess.createRegistryItem(item)
}

export async function getRegistryItems(userId: string): Promise<RegistryItem[]> {
    return await registryAccess.getRegistryItems(userId)
}

export async function getRegistryItemById(itemId: string, userId: string): Promise<RegistryItem> {
    return await registryAccess.getRegistryItemById(itemId, userId);
}

export async function updateRegistryItem(
    itemId: string, userId: string,
    updatedRegistryItem: UpdateRegistryItemRequest,) {
    return await registryAccess.updateRegistryItem(itemId, userId, updatedRegistryItem)
}

export async function deleteRegistryItem(itemId: string, userId: string) {
    return await registryAccess.deleteRegistryItem(itemId, userId)
}

export async function generateUploadUrl(itemId: string, userId: string): Promise<string> {
    const imageId = uuid.v4()
    const url = registryAccess.getUploadUrl(imageId)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

    await registryAccess.updateRegistryItemWithUploadUrl(itemId, userId, imageUrl)
    return url
}