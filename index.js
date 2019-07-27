'use strict';

const AWS = require('aws-sdk');

/**
 * Handles the lambda API calls
 * @param {Object} data
 */
module.exports.callback = async ( data ) => 
{
    const config = {
        awsRegion: process.env.region,
        db: {
            tableNames: {
                jobs : process.env.tableSmsRecords
            }
        },
    };
    const parsedData = JSON.parse( data.body );

    let responseData;
    
    try {

        responseData = {
            statusCode: 200,
        };
    } 
    catch( err ) {
        console.log( err );

        responseData = {
            statusCode: 500,
            body      : err
        };
    }
    finally {
        return responseData;
    }
}