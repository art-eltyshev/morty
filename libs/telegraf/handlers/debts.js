const db = require('../../db');
const users = require('../../db/users');

const helpText = '/debts';

function handler(telegraf) {
    telegraf.command('debts', (ctx) => {
        return db.getDebts().then(({data}) => {
            const text = Object.keys(data).reduce((str, debtor) => {
                str += Object.keys(data[debtor]).reduce((str, creditor) => {
                    if (data[debtor][creditor]) {
                        str += `${users.getName(debtor)} → ${users.getName(creditor)}: ${data[debtor][creditor]} ₽\n`;
                    }
                    return str;
                }, '');
                return str;
            }, '');

            return ctx.reply(text, {reply_to_message_id: ctx.message.message_id});
        })
    });
}

module.exports = {
    handler,
    helpText,
};
