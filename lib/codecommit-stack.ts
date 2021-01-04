import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { PhysicalName } from '@aws-cdk/core';
import * as iam  from '@aws-cdk/aws-iam';
import { S3DeployAction } from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import { Artifact } from '@aws-cdk/aws-codepipeline';
// import * as cloudformation from @aws-cdk/aws-cloudformation;

export class CodecommitStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const repository = new codecommit.Repository(this, 'MyRepository', {
      repositoryName: 'MyRepository',
    });
    
    const project = new codebuild.PipelineProject(this, 'MyProject',{buildSpec:codebuild.BuildSpec.fromObject({
      
        "version": 0.2,
        "phases": {
          "install": {
            "runtime-versions": {
              "python": 3.8
            }
          },
          "build": {
            "commands": [
              "echo \"install pandas and numpy\"",
              "mkdir dep",
                  ]
          },
          "post_build": {
            "commands": [
              "aws cloudformation package --template-file function.yml --s3-bucket $S3BUCKET --force-upload --output-template-file function-out.yml"
            ]
          }
        },
        
        "artifacts": {
          "type": "zip",
          "files": [
            "function.yml",
            "function-out.yml"
          ]
        }
        /*
        artifacts: codebuild.Artifacts.s3({
        
          bucket,
          includeBuildId: false,
          packageZip: true,
          path: '/',
          identifier: 'function-out.yml'
          */,
    }),
      })
    
    const sourceOutput = new codepipeline.Artifact();
    
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository,
      output: sourceOutput,
    });
    
   /*
   const sourceAction = new codepipeline_actions.BitBucketSourceAction({
    actionName: 'BitBucket_Source',
    owner: 'aws',
    repo: 'devops',
    output: sourceOutput,
    connectionArn: 'arn:aws:codestar-connections:us-east-2:467343721842:connection/8bf75d29-6496-457e-81c7-217b0ca04ab9',
  });
  */
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()], // optional
      executeBatchBuild: true // optional, defaults to false
    });
    const actionRole = new iam.Role(this, 'ActionRole', {
      assumedBy: new iam.AccountPrincipal('467343721842'),
      // the role has to have a physical name set
      roleName: PhysicalName.GENERATE_IF_NEEDED,
    });
    
    // in the pipeline stack...
    // const deployaction = new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction ({
    //   actionName:'CloudFormation',
    //   changeSetName:'Changeset',
    //   role: actionRole, // this action will be cross-account as well
    // });
    const executeOutput = new codepipeline.Artifact('CloudFormation');
    /*
    const updateAction = new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
      adminPermissions:true,
      templatePath:'BuildArtifact::function-out.yml'
      actionName: 'ChangeChangesTest',
      runOrder: 1,
      stackName:'test',
      changeSetName:'test',
      outputFileName: 'overrides.json',
      output: executeOutput,
});*/
    const executeChangeSetAction = new codepipeline_actions.CloudFormationExecuteChangeSetAction({
      actionName: 'ExecuteChangesTest',
      runOrder: 2,
      stackName:'test',
      changeSetName:'test',
      outputFileName: 'overrides.json',
      output: executeOutput,
});
    new codepipeline.Pipeline(this, 'MyPipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy',
          actions: [executeChangeSetAction],
        }
      ],
    });

    
    

    // The code that defines your stack goes here
  }
}
