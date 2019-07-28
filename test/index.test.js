'use strict';

const expect  = require('chai').expect;
const assert  = require('chai').assert;
const sinon   = require('sinon');
const sandbox = sinon.createSandbox();

const SMSService     = require('../src/services/SMSService.js');
const RecordsAdapter = require('../src/adapters/RecordsAdapter.js');

const lambda = require('../src/index.js');

describe('Tests the SMS API lambda', _ => 
{
    it( 'Tests the SMS is sent successfully', async () => 
    {
        const sms = {
            id         : '12345ABCD',
            phoneNumber: '+1234567890',
            message    : 'This is a unit test!',
        };

        // Mocks the used classes
        const smsPromise = new Promise(( resolve ) => 
        { 
            resolve( sms.id );
        });
        sandbox.stub( SMSService.prototype, 'sendMessage' ).returns( smsPromise );

        const recordsAdapterMock = sinon.mock( RecordsAdapter.prototype );
        recordsAdapterMock.expects( 'createRecord' ).once().withArgs( sms );

        // Builds the fake request and calls the lambda
        const data = {
            body: JSON.stringify( {
                    phoneNumber: sms.phoneNumber,
                    message    : sms.message
                }, null, 2 )
        }

        let response = await lambda.send( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 200 );

        // Restore the original methods to prevent other tests failing
        recordsAdapterMock.restore();
        sandbox.restore();
    } );

    it( 'Tests the send SMS API call is missing data', async () => 
    {
        // Builds the fake request and calls the lambda
        const data = {
            body: JSON.stringify( {
                    phoneNumber: '+31239056789',
                    // No message this time
                }, null, 2 )
        }

        let response = await lambda.send( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 400 );
    } );

    it( 'Tests an error with the SMS end process', async () => 
    {
        const sms = {
            phoneNumber: '+1234567890',
            message    : 'This is a unit test!',
        };

        // Mocks the used classes
        const smsPromise = new Promise(( resolve, reject ) => 
        { 
            // I'm intentionally making this fail
            reject( 'error something' );
        });
        sandbox.stub( SMSService.prototype, 'sendMessage' ).returns( smsPromise );

        // Builds the fake request and calls the lambda
        const data = {
            body: JSON.stringify( {
                    phoneNumber: sms.phoneNumber,
                    message    : sms.message
                }, null, 2 )
        }

        let response = await lambda.send( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 500 );

        // Restore the original methods to prevent other tests failing
        sandbox.restore();
    } );

    it( 'Tests the history is retrieved correctly', async () => 
    {
        const records = [
        {
          "phoneNumber": "+1234567890",
          "dateSent"   : "2019-07-28T11:09:56Z",
          "message"    : "Hello World!",
          "id"         : "ac0d5272-6083-43ae-adf2-c53dd7df4739",
          "snsId"      : "3a874d9a-1aed-593b-8a4f-182d9e29dfa2"
        },
        {
          "phoneNumber": "+1234567890",
          "dateSent"   : "2019-07-28T11:20:36Z",
          "message"    : "Hello World!",
          "id"         : "2dc11a5b-81b1-4d58-a3e2-606640351189",
          "snsId"      : "45fe1cf4-fb59-52e2-a8b4-49437c1d6a4d"
        }
        ];

        // Mocks the used classes
        const recordsPromise = new Promise(( resolve ) => 
        { 
            resolve( records );
        });
        sandbox.stub( RecordsAdapter.prototype, 'getRecords' ).returns( recordsPromise );

        // Builds the fake request and calls the lambda
        const data = {
            queryStringParameters: {
                phoneNumber: '+1234567890'
            }
        };

        let response = await lambda.history( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 200 );
        assert.equal( response.body, JSON.stringify( records ) );

        // Restore the original methods to prevent other tests failing
        sandbox.restore();
    } );
} );
