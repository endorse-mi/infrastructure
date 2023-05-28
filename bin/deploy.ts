#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { ENVIRONMENT } from '../lib/config';

const app = new cdk.App();
new InfrastructureStack(app, `infrastructure-stack-${ENVIRONMENT}`);
