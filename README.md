# Build a pipeline from CDK which can update code to Lambda.

This is my architecture diagram.

![image](https://user-images.githubusercontent.com/59716276/103523108-5743af00-4eb6-11eb-80e5-592825be6a00.png)

./function.yml: For CloudFormation to create lambda.  

./buildspec.yml: Run shell and upload CloudFormation template to S3 bucket by CodeBuild.  

./lambda_function.py: For creating Lambda Function by CloudFormation.  


AWS Resource used as below:

1. Source: CodeCommit/Bitbucket
2. Build: CodeBuild
   In this stage,CodeBuild will compile and output the yml file. 
3. Deploy: CloudFormation, 
   In this stage,CloudFormation will create and update the stack with the yml file from CodeBuild. 


