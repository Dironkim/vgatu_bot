import { Bot } from '@maxhub/max-bot-api';
import 'dotenv/config';
const bot = new Bot(process.env.BOT_TOKEN);
// Обработчик события запуска бота
bot.on('bot_started', (ctx) => ctx.reply('Привет! Я - официальный чат-бот Вятского агротехнологического университета.'));
// Обработчик для всех входящих сообщений
bot.on('message_created', (ctx) => ctx.reply("Я еще нахожусь в разработке и не могу ответить на Ваш вопрос."));
bot.start();
//# sourceMappingURL=index.js.map