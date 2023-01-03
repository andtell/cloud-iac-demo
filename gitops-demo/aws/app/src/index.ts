import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    
    const bodyString: string = event.body ? Buffer.from(event.body, 'base64').toString('utf-8') : "n/a";

    console.log("Raw body: " + event.body);
    console.log("Recieved " + bodyString);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: '*** Meh ***',
            postedBodeh: JSON.parse(bodyString)
        }),
    };
};
