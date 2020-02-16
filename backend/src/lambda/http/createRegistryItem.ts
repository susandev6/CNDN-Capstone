import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateRegistryItemRequest } from '../../requests/CreateRegistryItemRequest'
import { getUserId } from '../utils'
import { createRegistryItem } from '../../businessLogic/registryLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newItem: CreateRegistryItemRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const item = await createRegistryItem(newItem, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
