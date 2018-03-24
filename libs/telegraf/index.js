const Telegraf = require('telegraf');

const spend = require('./handlers/spend');
const debts = require('./handlers/debts');

const replyWithHelp = ctx =>
    ctx.reply([
        spend.helpText,
        debts.helpText,
    ].join('\n'));

module.exports = (token) => {
    const telegraf = new Telegraf(token, {username: 'MortyAccountantBot'});

    telegraf.start(replyWithHelp);
    telegraf.help(replyWithHelp);

    spend.handler(telegraf);
    debts.handler(telegraf);

    return telegraf;
}
