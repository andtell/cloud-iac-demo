import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


export const bucketMap = new Map<string, aws.s3.Bucket>();

["imperative", "infrastructure", "declaration"].forEach( s => {
    bucketMap.set(s, createBucket(s));
})

// Create an AWS resource (S3 Bucket)
function createBucket(name: string) : aws.s3.Bucket {
    return new aws.s3.Bucket(name, {
        tags : {
            Cadec: '2023',
            Environment: pulumi.StackReference.name,
            Name: name,
        },
    });
}
