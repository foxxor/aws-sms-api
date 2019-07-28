# AWS SMS API

An API to send SMS to any cellphone, this application also stores a record of the sent SMS in a dynamodDB table.

This project uses the [AWS SNS SMS publishing functionality](https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html).

### Pre-requisites

1. [NPM](https://docs.npmjs.com/cli/install), accessible through your CLI console.
2. [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/), installed globally and accessible through your CLI console.
3. AWS, an AWS account, and a IAM User with the credentials configured in your CLI console.
4. An AWS lambda execution role, with the following permissions:
    * AWS SNS access
    * AWS DynamoDB access

### Installation

1. Install the required NPM packages
```
$ npm i
```
2. Copy the `serverless.dist.yml` to a new `serverless.yml` file, update the data to match your AWS account.
3. Run Serverless to deploy the serverless components
```
$ sls deploy
```

### Usage

After your serverless stack is deployed, copy the URL with the endpoint and do a POST request. Sending a JSON with the phone number and the message you want to send to `/sendMessage`:

```
{
    "phoneNumber": "+31612345678",
    "message": "Hello World!"
}
```

To retrieve the log of sent messages, make a GET request to the `/history` endpoint passing a `phoneNumber` query string / parameter and the number you want to query.

### Testing

You can unit test this application by using:
```
$ npm test
```
