import { type Construct } from 'constructs';
import { UserPool, UserPoolClient, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { RemovalPolicy } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { ENVIRONMENT } from '../config';

export class Cognito {
  constructor(scope: Construct) {
    const userPool = new UserPool(scope, 'user-pool', {
      userPoolName: `endorse-mi-user-pool-${ENVIRONMENT}`,
      // By setting this to true, users can sign themselves up for the user pool without
      // requiring an administrator to create the user account.
      selfSignUpEnabled: true,
      // signInAliases are ways in which a user can sign in to the user pool.
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
      },
      standardAttributes: {
        email: {
          required: true,
        },
      },
      userVerification: {
        emailSubject: 'Here is your verification code!',
        emailBody: 'Hello, your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new UserPoolClient(scope, 'user-pool-client', {
      userPool,
      userPoolClientName: `endorse-mi-user-pool-client-${ENVIRONMENT}`,
      authFlows: {
        // The userSrp flow uses the SRP protocol (Secure Remote Password) where the password
        // never leaves the client and is unknown to the server. Whereas the userPassword
        // flow will send user credentials unencrypted to the back-end.
        userSrp: true,
      },
    });

    new StringParameter(scope, 'user-pool-arn', {
      parameterName: `/${ENVIRONMENT}/infrastructure/user/cognito-user-pool-arn`,
      stringValue: userPool.userPoolArn,
    });
  }
}
