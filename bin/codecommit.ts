#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CodecommitStack } from '../lib/codecommit-stack';

const app = new cdk.App();

new CodecommitStack(app, 'CodecommitStack')


