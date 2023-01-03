import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { CustomResource } from '@pulumi/pulumi';

const pulumiConfig = new pulumi.Config();

const ARGO_CD_NAMESPACE = "argocd";

export function newArgoApplication(appNameSpace: string, kubeconfig: pulumi.Input<string>) : CustomResource {
    // Create the k8s provider with the kubeconfig.
    const provider = new k8s.Provider("k8sProvider", {kubeconfig});

    const ns = new k8s.core.v1.Namespace(appNameSpace + "-ns", {
        metadata: { name: appNameSpace },
    }, { provider });

    return new k8s.apiextensions.CustomResource(
        "cadec-demo-app",
        {
            apiVersion: "argoproj.io/v1alpha1",
            kind: "Application",
            metadata: {
                namespace: ARGO_CD_NAMESPACE, // the ns where argocd is deployed
                name: appNameSpace, // name of app in ArgoCd
            },
            spec: {
                destination: {
                    namespace: ns.metadata.name,
                    server: "https://kubernetes.default.svc",
                },
                project: "default",
                source: {
                    path: "demo-app/argocd-app-config/dev",
                    repoURL: "https://github.com/andtell/cloud-iac-demo/",
                    targetRevision: "HEAD",
                },
                syncPolicy: {
                    automated: {}
                }
            }
        },
        {provider: provider}
    );


}

// Exposing app https://aws.amazon.com/premiumsupport/knowledge-center/eks-kubernetes-services-cluster/

/*

kubectl get service guestbook-ui -n cadec-demo
kubectl get service guestbook-ui -n cadec-demo

kubectl expose deployment guestbook-ui --type=ClusterIP  --name=guestbook-ui-ip -n cadec-demo

*/