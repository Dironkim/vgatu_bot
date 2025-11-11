import 'dotenv/config';
import { Bot } from '@maxhub/max-bot-api';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN не найден в окружении');
  process.exit(1);
}

let bot: Bot;

// Функция для запуска бота с защитой от обрывов
async function startBot() {
  try {
    console.log('Запуск бота...');
    bot = new Bot(token!);

    bot.on('bot_started', (ctx: any) =>
      ctx.reply('Привет! Я - официальный чат-бот Вятского агротехнологического университета.')
    );


    bot.on('message_created', (ctx: any) => ctx.reply('Я еще нахожусь в разработке и не могу ответить на Ваш вопрос.'));

    await bot.start();
    console.log('Бот успешно запущен и слушает события.');
  } catch (error: any) {
    console.error('Ошибка при запуске бота:', error.message || error);

    // Проверяем, сеть ли это
    if (error.code === 'ECONNRESET' || error.message?.includes('fetch failed')) {
      console.warn('Потеря соединения с сервером MAX. Переподключение через 10 секунд...');
      setTimeout(startBot, 10_000);
    } else {
      console.error('Критическая ошибка — бот остановлен.');
      process.exit(1);
    }
  }
}

// Глобальные обработчики ошибок, чтобы не упал процесс
process.on('unhandledRejection', (err) => {
  console.error('Необработанное исключение:', err);
  if (String(err).includes('ECONNRESET')) {
    console.log('Попробуем переподключиться через 10 секунд...');
    setTimeout(startBot, 10_000);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Непойманная ошибка:', err);
  if (String(err).includes('ECONNRESET')) {
    console.log('Перезапуск через 10 секунд...');
    setTimeout(startBot, 10_000);
  }
});

startBot();
