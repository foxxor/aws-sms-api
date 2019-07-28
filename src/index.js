'use strict';

const SMSService     = require('./services/SMSService.js');
const RecordsAdapter = require('./adapters/RecordsAdapter.js');

/**
 * Handles the lambda API calls
 * @param {Object} data
 */
module.exports.run = async ( data ) => 
{
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

    const smsService     = new SMSService( serviceConfig );
    const recordsAdapter = new RecordsAdapter( adapterConfig );

    const parsedData = JSON.parse( data.body );

    let responseData = {
        statusCode: 200
    };
    
    try {
        // Check if the right params were sent
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
