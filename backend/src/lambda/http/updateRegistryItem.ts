import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { updateRegistryItem } from '../../businessLogic/registryLogic'

import { UpdateRegistryItemRequest } from '../../requests/UpdateRegistryItemRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const itemId = event.pathParameters.registryItemId
  const updatedItem: UpdateRegistryItemRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  await updateRegistryItem(itemId, userId, updatedItem)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
