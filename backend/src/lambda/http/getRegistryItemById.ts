import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { getRegistryItemById } from '../../businesslogic/registryLogic'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    var itemId = event.pathParameters.registryItemId

    const userId = getUserId(event)
    const item = await getRegistryItemById(itemId, userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
        body: JSON.stringify({
            item
        })
    }

}