import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { PhysicalName } from '@aws-cdk/core';
import * as iam  from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as cfn from '@aws-cdk/aws-cloudformation';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import { countResources } from '@aws-cdk/assert';
import { CloudFormationCapabilities } from '@aws-cdk/aws-cloudformation';
import * as core from '@aws-cdk/core';

export class CodecommitStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create Cloudformation execrole
    const changeSetExecRole = new Role(this, 'ChangeSetRole',
    {assumedBy:new ServicePrincipal('cloudformation.amazonaws.com')
    }
    )

    //Create s3 bucket for CodeBuild Artifact
    const s3bucket = "leo-cicd-cdk-test"

    //Create source 
    const repository = new codecommit.Repository(this, 'MyRepository', {
      repositoryName: 'MyRepository',
    });
    
    const buildspecfilename = "buildspec.yml"
        //Create CodeBuild Project and buildspec.yml
    const project = new codebuild.PipelineProject(this,'foo',{buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      environment:{
      environmentVariables:{
        S3BUCKET:{
          type:codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value:s3bucket
        }
      }
    },
    
    })
    /*const project = new codebuild.PipelineProject(this, 'MyProject',{buildSpec:codebuild.BuildSpec.fromObject({
      
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
          
    }),    
    environment:{
      environmentVariables:{
        S3BUCKET:{
          type:codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value:s3bucket
        }
      }
    }
      })*/

    // add permission to codebuild for uploading artifact to S3




    //===Create Artifact===
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    //===Create Source Action===
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      branch:'master',
      repository,
      output: sourceOutput,
    });
    
   /*Add Bitbucket Source
   const sourceAction = new codepipeline_actions.BitBucketSourceAction({
    actionName: 'BitBucket_Source',
    owner: 'aws',
    repo: 'devops',
    output: sourceOutput,
    connectionArn: 'arn:aws:codestar-connections:us-east-2:accountid:connection/connectionarn,
  });
  */
    //===Create Build Action===
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [buildOutput],
      // executeBatchBuild: true // optional, defaults to false
    });

    
    // const actionRole = new iam.Role(this, 'ActionRole', {
    //   assumedBy: new iam.AccountPrincipal('467343721842'),
    //   // the role has to have a physical name set
    //   roleName: PhysicalName.GENERATE_IF_NEEDED,
    // });
    
    //===Create Deploy phase===
    changeSetExecRole.addToPolicy(new PolicyStatement({resources:['*'],actions:[
    "events:EnableRule",
    "events:PutRule",
    "iam:CreateRole",
    "iam:AttachRolePolicy",
    "iam:PutRolePolicy",
    "cloudformation:CreateChangeSet",
    "iam:PassRole",
    "iam:DetachRolePolicy",
    "events:ListRuleNamesByTarget",
    "iam:DeleteRolePolicy",
    "events:ListRules",
    "events:RemoveTargets",
    "events:ListTargetsByRule",
    "events:DisableRule",
    "sns:*",
    "events:PutEvents",
    "iam:GetRole",
    "events:DescribeRule",
    "iam:DeleteRole",
    "s3:GetBucketVersioning",
    "events:TestEventPattern",
    "events:PutPermission",
    "events:DescribeEventBus",
    "events:TagResource",
    "events:PutTargets",
    "events:DeleteRule",
    "s3:GetObject",
    "lambda:*",
    "events:ListTagsForResource",
    "events:RemovePermission",
    "iam:GetRolePolicy",
    "s3:GetObjectVersion",
    "events:UntagResource",
    "kms:Decrypt",
    "kms:DescribeKey",
  ]}))

    const stackName = "BrelandsStack";
    const changeSetName = 'MyMagicChangeSet'
    // const deployAction = new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
    //   actionName: 'Deployment',
    //   runOrder:1,
    //   adminPermissions:false,
    //   stackName:"BrelandsStack",
    //   changeSetName:'MyMagicChangeSet',
    //   templatePath:new codepipeline.ArtifactPath(buildOutput,'function-out.yml'),
    //   });
      
    //   const executeChangeSetAction = new codepipeline_actions.CloudFormationExecuteChangeSetAction({
    //     actionName: 'ExecuteChangesTest',
    //     runOrder: 2,
    //     stackName:"BrelandsStack",
    //     changeSetName:'MyMagicChangeSet',
    //   });
    
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
    /*
    const executeChangeSetAction = new codepipeline_actions.CloudFormationExecuteChangeSetAction({
      actionName: 'ExecuteChangesTest',
      runOrder: 2,
      stackName:'test',
      changeSetName:'test',
      outputFileName: 'overrides.json',
      output: executeOutput,
});*/

    //===Create pipeline each phase===
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
          actions: [
            new cpactions.CloudFormationCreateReplaceChangeSetAction({
              
                  actionName: 'Deployment',
                  runOrder:1,
                  adminPermissions:true,
                  capabilities:[cfn.CloudFormationCapabilities.ANONYMOUS_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND],
                  stackName,
                  changeSetName,
                  deploymentRole:changeSetExecRole,
                  templatePath:new codepipeline.ArtifactPath(buildOutput,'function-out.yml'),
                  }),
            new cpactions.CloudFormationExecuteChangeSetAction({
                  
                  actionName: 'ExecuteChangesTest',
                  runOrder: 2,

                  stackName:"BrelandsStack",
                  changeSetName:'MyMagicChangeSet',
                  
            })
            
          ],
        },
      ],
    });

    
    

    // The code that defines your stack goes here
  }
}
