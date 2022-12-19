import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
//import * as awsx from "@pulumi/awsx";

/* export const bucketMap = new Map<string, aws.s3.Bucket>();

["imperative", "infrastructure", "definitions", "rocks"]
.forEach( s => {
    bucketMap.set(s, createBucket(s));
})

// Create an AWS resource (S3 Bucket)
function createBucket(name: string) : aws.s3.Bucket {
    if(pulumi.getStack() !== 'prod') {
        name = name + "-" + pulumi.getStack();
    }
    return new aws.s3.Bucket(name, {
        tags : {
            Cadec: '2023',
            Environment: pulumi.getStack(),
            Name: name,
        },
    });
} */

if(process.env.CI) {
    console.log(" ***************** ")
    console.log("process.env.CI : " + process.env.CI)
    console.log(" ***************** ")
}

const lambdaRole = new aws.iam.Role("lambdaRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({Service: "lambda.amazonaws.com"}),
});

const lambdaBasicExecutionRole = new aws.iam.RolePolicyAttachment("basicExecutionRole", {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// A Lambda function to invoke
// https://www.pulumi.com/registry/packages/aws/api-docs/lambda/function/
const myLamb = new aws.lambda.Function("vote-handler-fn-dfk", {
    code: new pulumi.asset.FileArchive("../app/function.zip"),
    role: lambdaRole.arn,
    handler: "index.handler", // references the exported function in index.js
    runtime: "nodejs16.x",
    environment: {
        variables: {
            foo: "bar",
        },
    },
});

// const helloHandler = new aws.lambda.CallbackFunction("hello-handler", {
//     callback: async (ev, ctx) => {
//       return {
//         statusCode: 200,
//         body: "Hello, API Gateway!",
//       };
//     },
//   });




// A REST API to route requests to HTML content and the Lambda function
const api = new apigateway.RestAPI("api", {
    stageName: `${pulumi.getStack()}`,
    routes: [
        // { path: "/", localPath: "www"},
        { path: "/vote", method: "POST", eventHandler: myLamb },
    ]
});

// The URL at which the REST API will be served.
export const url = api.url;