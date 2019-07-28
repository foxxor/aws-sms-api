# AWS SMS API

### Pre-requisites

1. [NPM](https://docs.npmjs.com/cli/install), accessible through your CLI console.
2. [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/), installed globally and accessible through your CLI console.
3. AWS, an AWS account, and a IAM User with the credentials configured in your CLI console.
4. An AWS lambda execution role, with the following permissions:
    * AWS SNS access
    * AWS DynamoDB access

# Installation

1. Install the required NPM packages
```
$ npm i
```
2. Copy the `serverless.dist.yml` to a new `serverless.yml` file, update the data to match your AWS account.
3. Run Serverless to deploy the serverless components
```
$ sls deploy
```