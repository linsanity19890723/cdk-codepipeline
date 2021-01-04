# Build a pipeline from CDK which can update code to Lambda.

This is my architecture diagram.

![image](https://user-images.githubusercontent.com/59716276/103523108-5743af00-4eb6-11eb-80e5-592825be6a00.png)

AWS Resource used as below:

1. Source: CodeCommit/Bitbucket
2. Build: CodeBuild,
   In this stage,CodeBuild will compile and output the yml file. 
3. Deploy: CloudFormation, 
   In this stage,CloudFormation will create and update the stack with the yml file from CodeBuild. 


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
