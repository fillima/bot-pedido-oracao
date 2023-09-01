process.env.NTBA_FIX_319 = 1;

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const TelegramBot = require('node-telegram-bot-api');

const { telegramConfig } = require('./server/configs');
const { BotController } = require('./server/controllers');

const bot = new TelegramBot(telegramConfig.token, { polling: true });
const botController = new BotController(bot);

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});

botController.handle();
