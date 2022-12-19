# Setup dev env

npm init -y
npm install typescript -D
npm install @types/node -D
npm install @types/aws-lambda -D

npx tsc --init --rootDir src --outDir dist --esModuleInterop --module commonjs --allowJs true 

# .gitignore

cat <<EOT >> .gitignore
/dist/
/node_modules/
EOT

# Simple lambda source code

mkdir src && cd src 

cat <<EOT >> index.ts 
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    const bodyString: string = event.body ? Buffer.from(event.body, 'base64').toString('utf-8') : "n/a";

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: '*** You voted for AWS ***',
            postedBodey: JSON.parse(bodyString)
        }),
    };
};
EOT

# Extend build script

"build": "tsc",
    "prodbuild": "rm -rf dist && npm ci && npm run-script build",
    "postbuild": "rm -f function.zip && cp -R node_modules dist && cd dist && zip -r ../function.zip .",

cd gitops-demo/aws/app