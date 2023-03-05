import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";

export class Cognito extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "user-pool", {
      userPoolName: "endorse-mi-user-pool",
      // by setting this to true, users can sign themselves up for the user pool without
      // requiring an administrator to create the user account
      selfSignUpEnabled: true,
      // sign-in aliases are ways in which a user can sign in to the user pool
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
        familyName: {
          required: true,
        },
        givenName: {
          required: true,
        },
        profilePage: {
          required: true,
        },
      },
      userVerification: {
        emailSubject: "Verify your email for the app!",
        emailBody: "Hello, thanks for signing up click {####}",
        emailStyle: VerificationEmailStyle.CODE,
      },
    });

    new UserPoolClient(this, "user-pool-client", {
      userPool,
      userPoolClientName: "endorse-mi-user-pool-client",
      authFlows: {
        userPassword: true,
      },
    });
  }
}
