import * as dotenv from "dotenv";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

dotenv.config();

export class AReznikovCartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const postgresHost = process.env.POSTGRES_HOST;
    const postgresPort = process.env.POSTGRES_PORT;
    const postgresUsername = process.env.POSTGRES_USERNAME;
    const postgresPassword = process.env.POSTGRES_PASSWORD;
    const postgresDatabase = process.env.POSTGRES_DATABASE;

    if (
      !(
        postgresHost &&
        postgresPort &&
        postgresUsername &&
        postgresPassword &&
        postgresDatabase
      )
    ) {
      throw Error(
        "Failed to create AReznikovCartServiceStack. Environment variables are not defined!"
      );
    }

    const cartLambda = new Function(this, "AReznikovCartLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "lambda.handler",
      code: Code.fromAsset(path.join(__dirname, "../../nest/dist")),
      environment: {
        POSTGRES_HOST: postgresHost,
        POSTGRES_PORT: postgresPort,
        POSTGRES_USERNAME: postgresUsername,
        POSTGRES_PASSWORD: postgresPassword,
        POSTGRES_DATABASE: postgresDatabase,
      },
      timeout: cdk.Duration.seconds(5),
    });

    new apigateway.LambdaRestApi(this, "AReznikovCartApiGateway", {
      restApiName: "AReznikovCartAPIGateway",
      handler: cartLambda,
      proxy: true,
    });
  }
}
