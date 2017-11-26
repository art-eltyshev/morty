const helpText = '/debts';

function handler(telegraf) {
    telegraf.command('debts', ctx => ctx.reply('debts'));
}

module.exports = {
    handler,
    helpText,
};
