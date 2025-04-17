#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AReznikovCartServiceEbStack } from "../lib/cart-service-eb-stack";

const app = new cdk.App();
new AReznikovCartServiceEbStack(app, "AReznikovCartServiceEbStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
