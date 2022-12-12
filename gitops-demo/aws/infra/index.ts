import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


export const bucketMap = new Map<string, aws.s3.Bucket>();

["cadec2023-gbg", "imperative", "infrastructure", "declarations", "rocks"].forEach( s => {
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
}
