# AWS SMS API

### Pre-requisites

1. Serverless Framework, installed globally and accessible through your CLI console.
2. NPM, accessible through your CLI console.
3. AWS, an AWS account, and a IAM User with the credentials configured in your CLI console.
4. A lambda execution role, with the following permissions:
    * AWS SNS access
    * AWS DynamoDB access

# Installation

1. Install the required NPM packages
```
$ npm i
```
2. Copy the `serverless.dist.yml` to a new `serverless.yml` file, update the data to match your AWS role.
3. Run Serverless to deploy the serverless components
```
$ sls deploy
```