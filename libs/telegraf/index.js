const Telegraf = require('telegraf');

const spend = require('./handlers/spend');
const debts = require('./handlers/debts');

module.exports = (token) => {
    const telegraf = new Telegraf(token);

    telegraf.start(ctx =>
        ctx.reply([
            spend.helpText,
            debts.helpText,
        ].join('\n'))
    );

    spend.handler(telegraf);
    debts.handler(telegraf);

    return telegraf;
}
