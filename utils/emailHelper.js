//batchSend.js

exports.sendEmail = async (req, res) => {
    var SibApiV3Sdk = require('sib-api-v3-sdk');
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

        "sender": { "email": "sendinblue@sendinblue.com", "name": "Sendinblue" },
        "subject": "This is my default subject line",
        "htmlContent": "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
        "params": {
            "greeting": "This is the default greeting",
            "headline": "This is the default headline"
        },
        "messageVersions": [
            //Definition for Message Version 1 
            {
                "to": [
                    {
                        "email": "shehroz.virk147@example.com",
                        "name": "Jim Stevens"
                    },
                    {
                        "email": "anne@example.com",
                        "name": "Anne Smith"
                    }
                ],
                "htmlContent": "<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
                "subject": "We are happy to be working with you"
            },

            // Definition for Message Version 2
            {
                "to": [
                    {
                        "email": "shehroz.virk147@example.com",
                        "name": "Jim Stevens"
                    },
                    {
                        "email": "mark@example.com",
                        "name": "Mark Payton"
                    },
                    {
                        "email": "andrea@example.com",
                        "name": "Andrea Wallace"
                    }
                ]
            }
        ]

    }).then(function (data) {
        console.log(data);
        return data;
    }, function (error) {
        console.error(error);
    });
}