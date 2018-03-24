const db = require('../../db');
const users = require('../../db/users');

const helpText = '/spend сумма @за_кого за_что';

function handler(telegraf) {
    telegraf.command('spend', (ctx) => {
        const matched = ctx.message.text.match(/\/spend (\d+)(.*)/i);

        if (!matched) {
            return ctx.reply(helpText);
        }

        const params = matched.slice(1).map(p => p.trim()).filter(Boolean);

        const amount = params[0];
        let debtor;
        let comment;

        if (params[1]) {
            if (params[1][0] === '@') {
                debtor = users.getName(params[1].split(' ', 1)[0].slice(1)) || '';
                comment = params[1].substring(debtor.length + 1);
            } else {
                comment = params[1];
            }
        }

        return db.addTransaction({
            amount,
            comment,
            debtor,
            who: users.getName(ctx.message.from.username),
        }).then(() => {
            return ctx.reply('добавил!', {reply_to_message_id: ctx.message.message_id});
        }).catch(e => {
            if (e.code === 'out_of_rows') {
                return ctx.reply('таблица переполнена!', {reply_to_message_id: ctx.message.message_id});
            }
        });
    });
}

module.exports = {
    handler,
    helpText,
};
