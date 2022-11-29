import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const bucketMap = new Map<string, aws.s3.Bucket>();
export const bucketNames : string[] = ["hello", "iterative", "declarative", "world"];

// Create an AWS resource (S3 Bucket).
bucketNames.map((s: string) => {
    bucketMap.set(s, createBucket(s));
})

function createBucket(name: string) {
    return new aws.s3.Bucket(name, {
        tags : {
            Cadec: '2023',
            Environment: pulumi.StackReference.name,
            Name: name,
        },
    });
}

