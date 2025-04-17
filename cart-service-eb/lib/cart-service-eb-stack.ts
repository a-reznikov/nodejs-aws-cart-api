import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class AReznikovCartServiceEbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ebEndpoint =
      "a-reznikov-cart-api-develop.eu-central-1.elasticbeanstalk.com";

    const api = new apigateway.RestApi(this, "AReznikovCartEBAPI", {
      restApiName: "AReznikov Cart Service EB API",
      description: "API Gateway proxy for Elastic Beanstalk Cart Service",
      deployOptions: {
        stageName: "prod",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    const proxyResource = api.root.addResource("{proxy+}");

    proxyResource.addMethod(
      "ANY",
      new apigateway.HttpIntegration(`http://${ebEndpoint}/{proxy}`, {
        proxy: true,
        httpMethod: "ANY",
        options: {
          requestParameters: {
            "integration.request.path.proxy": "method.request.path.proxy",
          },
        },
      }),
      {
        requestParameters: {
          "method.request.path.proxy": true,
        },
      }
    );

    new cdk.CfnOutput(this, "AReznikovCartEBAPIEndpoint", {
      value: api.url,
      exportName: "AReznikovCartEBAPIEndpoint",
    });
  }
}
