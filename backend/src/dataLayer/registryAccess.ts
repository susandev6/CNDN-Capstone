import * as AWS from 'aws-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { RegistryItem } from '../models/RegistryItem'
import { RegistryItemUpdate } from '../models/RegistryItemUpdate'

export class RegistryAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly registryTable = process.env.REGISTRY_TABLE,
        private readonly userIndex = process.env.USER_ID_INDEX,
        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly bucketName = process.env.S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}

    async createRegistryItem(item: RegistryItem): Promise<RegistryItem> {
        await this.docClient.put({
            TableName: this.registryTable,
            Item: item
        }).promise()

        return item
    }

    async getRegistryItems(userId: string): Promise<RegistryItem[]> {
        const result = await this.docClient.query({
            TableName: this.registryTable,
            IndexName: this.userIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as RegistryItem[]
    }

    async getRegistryItemById(itemId: string, userId: string): Promise<RegistryItem> {
      const result = await this.docClient.get({
        TableName: this.registryTable,
        Key: {
          registryItemId: itemId,
          userId: userId
        }
      }).promise()

      return result.Item as RegistryItem;
    }

    async getItemUploadUrl(itemId: string): Promise<string> {
      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: itemId,
        Expires: parseInt(this.urlExpiration)
      })
    }

    async updateRegistryItem(itemId: string, userId: string, itemUpdate: RegistryItemUpdate) {
        await this.docClient.update({
            TableName: this.registryTable,
            Key: {
              registryItemId: itemId,
              userId: userId
            },
            UpdateExpression: "set #n = :n, #d = :d, #l = :l, #c = :c",
            ExpressionAttributeValues: {
              ":n": itemUpdate.name,
              ":d": itemUpdate.description,
              ":l": itemUpdate.link,
              ":c": itemUpdate.complete
            },
            ExpressionAttributeNames: {
              "#n": "name",
              "#d": "description",
              "#l": "link",
              "#c": "complete"
            },
            ReturnValues: "UPDATED_NEW"
          }).promise()
    }

    async deleteRegistryItem(itemId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.registryTable,
            Key: {
              userId: userId,
              registryItemId: itemId
            }
        }).promise()
    }

    getUploadUrl(imageId: string) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: +this.urlExpiration
        })
    }

    async updateRegistryItemWithUploadUrl(itemId: string, userId: string, uploadUrl: string) {
        await this.docClient.update({
            TableName: this.registryTable,
            Key: {
              registryItemId: itemId,
              userId: userId
            },
            UpdateExpression: "set imageUrl = :a",
            ExpressionAttributeValues:{
              ":a": uploadUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }
}
