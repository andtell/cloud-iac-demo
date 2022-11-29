import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an AWS resource (S3 Bucket)
export const bucket1 = new aws.s3.Bucket("my-gitops-bucket-test1",{
    tags : {
        Cadec: '2023',
        Environment: pulumi.StackReference.name,
        Name: 'wat',
    },
});
export const bucket2 = new aws.s3.Bucket("my-gitops-bucket-test2",{
    tags : {
        Cadec: '2023',
        Environment: pulumi.StackReference.name,
        Name: 'wat',
    },
});

// Export the name of the bucket
export const bucketName1 = bucket1.id;
export const bucketName2 = bucket2.id;
