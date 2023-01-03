import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import { newArgoApplication } from "./argoappdefinition";

// Grab some values from the Pulumi configuration (or use default values)
const config = new pulumi.Config();
const minClusterSize = config.getNumber("minClusterSize") || 3;
const maxClusterSize = config.getNumber("maxClusterSize") || 6;
const desiredClusterSize = config.getNumber("desiredClusterSize") || 3;
const eksNodeInstanceType = config.get("eksNodeInstanceType") || "t3.small";
// Problem : no available/free pods if choosing to too small EC2 instance, see: https://github.com/awslabs/amazon-eks-ami/blob/master/files/eni-max-pods.txt
const vpcNetworkCidr = config.get("vpcNetworkCidr") || "10.0.0.0/16";
const isMinikube = config.requireBoolean("isMinikube");

// Create a new VPC
const eksVpc = new awsx.ec2.Vpc("eks-vpc", {
    enableDnsHostnames: true,
    cidrBlock: vpcNetworkCidr,
});

// Create the EKS cluster
const eksCluster = new eks.Cluster("eks-cluster", {
    // Put the cluster in the new VPC created earlier
    vpcId: eksVpc.vpcId,
    // Public subnets will be used for load balancers
    publicSubnetIds: eksVpc.publicSubnetIds,
    // Private subnets will be used for cluster nodes
    privateSubnetIds: eksVpc.privateSubnetIds,
    // Change configuration values to change any of the following settings
    instanceType: eksNodeInstanceType,
    desiredCapacity: desiredClusterSize,
    minSize: minClusterSize,
    maxSize: maxClusterSize,
    // Do not give the worker nodes public IP addresses
    nodeAssociatePublicIpAddress: false,
    // Uncomment the next two lines for a private cluster (VPN access required)
    // endpointPrivateAccess: true,
    // endpointPublicAccess: false
    version: "1.24",
});

// Export some values for use elsewhere
export const kubeconfig = pulumi.secret(eksCluster.kubeconfig); // treat this as sensitive data
export const vpcId = eksVpc.vpcId;

// Deploy App -------------->

/*
// Deploy a small canary service (NGINX), to test that the cluster is working.
const appName = "my-app";
const appLabels = { appClass: appName };
const deployment = new k8s.apps.v1.Deployment(`${appName}-dep`, {
    metadata: { labels: appLabels },
    spec: {
        replicas: 2,
        selector: { matchLabels: appLabels },
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: appName,
                    image: "nginx",
                    ports: [{ name: "http", containerPort: 80 }]
                }],
            }
        }
    },
}, { provider: eksCluster.provider });

const service = new k8s.core.v1.Service(`${appName}-svc`, {
    metadata: { labels: appLabels },
    spec: {
        type: "LoadBalancer",
        ports: [{ port: 80, targetPort: "http" }],
        selector: appLabels,
    },
}, { provider: eksCluster.provider });

// Export the URL for the load balanced service.
export const url = service.status.loadBalancer.ingress[0].hostname;

*/

// Access via kubectl


// Create Kubernetes namespaces.

const provider: k8s.Provider = eksCluster.provider
const name = "argocd"
const argocdNamespace = new k8s.core.v1.Namespace("argocd-ns", {
    metadata: { name: name },
}, { provider: provider });


const argocd = new k8s.helm.v3.Chart("argocd", {
    namespace: argocdNamespace.metadata.name,
    fetchOpts: {
        repo: "https://argoproj.github.io/argo-helm"
    },
    chart: "argo-cd",
    values: {
        //installCRDs: false,
        server: {
            service: {
                type: isMinikube ? 'ClusterIP' : 'LoadBalancer',
            },
        }
    },
    // The helm chart is using a deprecated apiVersion,
        // So let's transform it
    transformations: [
        (obj: any) => {
            if (obj.apiVersion == "extensions/v1beta1")  {
                obj.apiVersion = "networking.k8s.io/v1beta1"
            }
        },
    ],
},
{ providers: { kubernetes: provider }},);


// Export the public IP for WordPress.
const frontend = argocd.getResource("v1/Service", "argocd/argocd-server");

// When "done", this will print the public IP.
export const ip = isMinikube
    ? frontend.spec.clusterIP
    : frontend.status.loadBalancer.apply(
          (lb) => lb.ingress[0].ip || "https://" + lb.ingress[0].hostname
      );


export const myapp  = newArgoApplication("cadec-demo", kubeconfig);
