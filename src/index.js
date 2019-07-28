'use strict';

const SMSService     = require('./services/SMSService.js');
const RecordsAdapter = require('./adapters/RecordsAdapter.js');

// Configuration for the classes
const serviceConfig = {
    aws: {
        region: process.env.region
    }
};
const adapterConfig = {
    aws: {
        region: process.env.region
    },
    db: {
        tables: {
            smsRecords : process.env.tableSmsRecords
        }
    }
};

/**
 * Handles the API requests to send SMS messages
 * @param  {Object} data
 * @return {Object}
 */
module.exports.send = async ( data ) => 
{
    // Initializes the helper classes
    const smsService     = new SMSService( serviceConfig );
    const recordsAdapter = new RecordsAdapter( adapterConfig );

    // Parses the body data
    const parsedData = JSON.parse( data.body );

    let responseData = {
        statusCode: 200
    };
    
    try {
        // Check if all the params were sent
        if ( !( 'phoneNumber' in parsedData ) || !( 'message' in parsedData ) )
        {
            responseData.statusCode = 400;
        }
        else 
        {
            let sms = {
                phoneNumber: parsedData.phoneNumber,
                message    : parsedData.message
            };

            // Sends the SMS and stores the message ID
            sms.id = await smsService.sendMessage( sms.phoneNumber, sms.message );

            // Stores a record in the DB
            await recordsAdapter.createRecord( sms );
        }  
    } 
    catch( err ) 
    {
        console.log( err );

        responseData = {
            statusCode: 500,
            body      : err
        };
    }
    finally 
    {
        return responseData;
    }
}

/**
 * Handles the history 
 * @param  {Object} data
 * @return {Object}
 */
module.exports.history = async ( data ) => 
{
    const recordsAdapter = new RecordsAdapter( adapterConfig );

    let responseData = {
        statusCode: 200
    };
    
    try {
        // Check if all the params were sent
        if ( !( 'phoneNumber' in data.queryStringParameters ) )
        {
            responseData.statusCode = 400;
        }
        else 
        {
            // Retrieves the records for the given phone number
            const records = await recordsAdapter.getRecords( data.queryStringParameters.phoneNumber );
            responseData.body = JSON.stringify( records );
        }  
    } 
    catch( err ) 
    {
        console.log( err );

        responseData = {
            statusCode: 500,
            body      : err
        };
    }
    finally 
    {
        return responseData;
    }
}
