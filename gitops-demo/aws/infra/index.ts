import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws-native";

// Create an AWS resource (S3 Bucket)
const bucket1 = new aws.s3.Bucket("my-gitops-bucket-test1");
const bucket2 = new aws.s3.Bucket("my-gitops-bucket-test2");

// Export the name of the bucket
export const bucketName1 = bucket1.id;
export const bucketName2 = bucket2.id;
