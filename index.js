const telegraf = require('./libs/telegraf');

exports.handler = (event, context) => {
    telegraf(process.env.BOT_TOKEN).handleUpdate(event).then(() => {
        context.succeed('OK');
    });
};
