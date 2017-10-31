const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const tableName = 'debts';

exports.handler = (event, context) => {
    console.log('Request received:\n', JSON.stringify(event));
    console.log('Context received:\n', JSON.stringify(context));

    dynamodb.scan({
        TableName: tableName,
    }, (err, data) => {
        if (err) {
            context.fail(`ERROR: Dynamo failed: ${err}`);
        } else {
            console.log('Data:', JSON.stringify(data));
            context.succeed('OK');
        }
    });
};

