import * as dotenv from "dotenv";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as ec2 from "aws-cdk-lib/aws-ec2";
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
    const vpcId = process.env.VPC_ID;
    const rdsSecurityGroupId = process.env.RDS_SECURITY_GROUP_ID;

    if (
      !(
        postgresHost &&
        postgresPort &&
        postgresUsername &&
        postgresPassword &&
        postgresDatabase &&
        vpcId &&
        rdsSecurityGroupId
      )
    ) {
      throw Error(
        "Failed to create AReznikovCartServiceStack. Environment variables are not defined!"
      );
    }

    const vpc = ec2.Vpc.fromLookup(this, "AReznikovVPC", {
      vpcId: vpcId,
    });

    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "AReznikovRDSSecurityGroup",
      rdsSecurityGroupId
    );

    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      "AReznikovLambdaSecurityGroup",
      {
        vpc,
        description: "Security group for Lambda to access RDS",
        allowAllOutbound: true,
      }
    );

    rdsSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow Lambda to connect to RDS"
    );

    const cartLambda = new Function(this, "AReznikovCartLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "lambda.handler",
      code: Code.fromAsset(path.join(__dirname, "../../nest/dist")),
      vpc,
      securityGroups: [lambdaSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      allowPublicSubnet: true,
      environment: {
        POSTGRES_HOST: postgresHost,
        POSTGRES_PORT: postgresPort,
        POSTGRES_USERNAME: postgresUsername,
        POSTGRES_PASSWORD: postgresPassword,
        POSTGRES_DATABASE: postgresDatabase,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
    });

    new apigateway.LambdaRestApi(this, "AReznikovCartApiGateway", {
      restApiName: "AReznikovCartAPIGateway",
      handler: cartLambda,
    });
  }
}
