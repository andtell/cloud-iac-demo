import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws-native";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-renamed-gitops-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;
