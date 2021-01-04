# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

This is my architecture diagram.
I want to build a pipeline from CDK.
AWS Resource used as below:
1. Source: CodeCommit/Bitbucket
2. Build: CodeBuild
3. Deploy: CloudFormation

This is 
https://user-images.githubusercontent.com/59716276/103522226-04b5c300-4eb5-11eb-8e2a-713ad8338d8c.png
