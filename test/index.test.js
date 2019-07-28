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

        let response = await lambda.run( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 200 );

        // Restore the original methods to prevent other tests failing
        recordsAdapterMock.restore();
        sandbox.restore();
    } );

    it( 'Tests the API call is missing data', async () => 
    {
        // Builds the fake request and calls the lambda
        const data = {
            body: JSON.stringify( {
                    phoneNumber: '+31239056789',
                    // No message this time
                }, null, 2 )
        }

        let response = await lambda.run( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 400 );
    } );

    it( 'Tests an error with the process', async () => 
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

        let response = await lambda.run( data );

        // Asserts the response is correct
        assert.equal( response.statusCode, 500 );

        // Restore the original methods to prevent other tests failing
        sandbox.restore();
    } );
} );
