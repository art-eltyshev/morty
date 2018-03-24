const path = require('path');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname + '/auth.json');

const {google} = require('googleapis');
const {auth: googleAuth} = require('google-auth-library');

const sheets = google.sheets('v4');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const TRANSACTIONS_FIRST_ROW = 5;
const TRANSACTIONS_LAST_ROW = 30;
const TRANSACTIONS_MAX_COUNT = TRANSACTIONS_LAST_ROW - TRANSACTIONS_FIRST_ROW + 1;
const TRANSACTIONS_RANGE = 'B5:E30';

const DEBTS_RANGE = 'I5:K7';

function authorize() {
    return googleAuth.getApplicationDefault().then(res => {
        return res.credential.createScoped(['https://www.googleapis.com/auth/spreadsheets']);
    })
}

function getTransactions() {
    return authorize().then(client =>
        new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                auth: client,
                spreadsheetId: SPREADSHEET_ID,
                range: TRANSACTIONS_RANGE,
            }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: response.data.values.map(x => ({
                            who: x[0],
                            amount: x[1],
                            comment: x[2],
                            debtor: x[3],
                        })),
                        auth: client,
                    });
                }
            });
        })
    );
}

function getDebts() {
    return authorize().then(client =>
        new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                auth: client,
                spreadsheetId: SPREADSHEET_ID,
                range: DEBTS_RANGE,
            }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: {
                            andreymedvedev: {
                                eltyy: Number(response.data.values[0][1].split(' ')[0]),
                                ms_mix_up: Number(response.data.values[0][2].split(' ')[0]),
                            },
                            eltyy: {
                                andreymedvedev: Number(response.data.values[1][0].split(' ')[0]),
                                ms_mix_up: Number(response.data.values[1][2].split(' ')[0]),
                            },
                            ms_mix_up: {
                                andreymedvedev: Number(response.data.values[2][0].split(' ')[0]),
                                eltyy: Number(response.data.values[2][1].split(' ')[0]),
                            },
                        },
                        auth: client,
                    });
                }
            });
        })
    );
}

function addTransaction({ who, amount, comment, debtor }) {
    return getTransactions().then(({data: transactions, auth}) => {
        // if (transactions.length === TRANSACTIONS_MAX_COUNT) {
        // }

        const row = TRANSACTIONS_FIRST_ROW + transactions.length;

        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.update({
                auth,
                spreadsheetId: SPREADSHEET_ID,
                range: `B${row}:E${row}`,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [[who, amount, comment, debtor || '']],
                },
            }, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: result.data,
                        auth,
                    });
                }
            });
        });
    });
}

module.exports = {
    getTransactions,
    getDebts,
    addTransaction,
};
