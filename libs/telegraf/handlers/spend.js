const helpText = '/spend <сумма> <кто> <комментарий>';

function handler(telegraf) {
    telegraf.command('spend', (ctx) => {
        const matched = ctx.message.text.match(/\/spend (\d+)(.*)/i);

        if (!matched) {
            ctx.reply(helpText);
        }

        const params = matched.slice(1).map(p => p.trim());

        return ctx.reply(`spend: params=${params}`);
    });
}

module.exports = {
    handler,
    helpText,
};
