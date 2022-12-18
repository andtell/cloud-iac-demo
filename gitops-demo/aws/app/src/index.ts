import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log();
    console.log();
    const bodyString: string = event.body ? Buffer.from(event.body, 'base64').toString('utf-8') : "n/a";

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: '*** You voted for AWS ***',
            postedBodey: JSON.parse(bodyString)
        }),
    };
};