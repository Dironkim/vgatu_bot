import 'dotenv/config';
import { Bot } from '@maxhub/max-bot-api';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN не найден');
  process.exit(1);
}

const bot = new Bot(token);

// Обработка ошибок SDK
bot.catch(async (err: any) => {
  console.error('Ошибка во время работы бота:', err);
});

// Функция запуска бота с защитой от обрывов соединения
async function startBot() {
  try {
    console.log('Запуск бота...');
    bot.on('bot_started', (ctx: any) =>
      ctx.reply('Привет! Я - официальный чат-бот Вятского агротехнологического университета.')
    );

    bot.on('message_created', (ctx: any) =>
      ctx.reply('Я ещё нахожусь в разработке и не могу ответить на ваш вопрос.')
    );

    await bot.start();
    console.log('Бот успешно запущен и слушает события.');
  } catch (err: any) {
    console.error('Ошибка при запуске бота:', err.message || err);

    if (
      err.code === 'ECONNRESET' ||
      err.message?.includes('fetch failed') ||
      err.message?.includes('Client network socket disconnected')
    ) {
      console.warn('Потеря соединения. Перезапуск через 5 секунд...');
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      await startBot(); // повторный запуск
    } else {
      console.error('Критическая ошибка. Остановка.');
      process.exit(1);
    }
  }
}

// Глобальные обработчики на случай непойманных исключений
process.on('unhandledRejection', (err) => {
  console.error('Необработанное исключение:', err);
  setTimeout(startBot, 5_000);
});

process.on('uncaughtException', (err) => {
  console.error('Ошибка в Node:', err);
  setTimeout(startBot, 5_000);
});

startBot();
