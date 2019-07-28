'use strict';

const AWS = require('aws-sdk');

class SMSService
{
    /**
     * Class constructor
     * @param {Object} config
     */
    constructor( config )
    {
        this.config = config;

        AWS.config.update( { region: this.config.aws.region } );    
        this.SNS = new AWS.SNS( { apiVersion: '2010-03-31' } );
    }

    /**
     * Sends a SMS message to the specificed phone number.
     * Returns the message ID from SNS
     * @param   {String} phoneNumber
     * @param   {String} message
     * @returns {Promise|String}
     */
    async sendMessage( phoneNumber, message )
    {
        let smsData = {
          Message: message,
          PhoneNumber: phoneNumber,
        };

        let response = await this.SNS.publish( smsData ).promise();

        return response.MessageId;
    }
}

module.exports = SMSService;