import 'dotenv/config';
import { Bot } from '@maxhub/max-bot-api';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN не найден в окружении');
  process.exit(1);
}

const bot = new Bot(token);


bot.catch(async (err:any) => {
  console.error('Ошибка в работе бота:', err);

  // Проверяем тип ошибки
  if (
    err?.code === 'ECONNRESET' ||
    err?.message?.includes('fetch failed') ||
    err?.message?.includes('ECONNREFUSED')
  ) {
    console.warn('Потеря соединения с MAX API. Перезапуск через 10 секунд...');
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    try {
      await bot.start();
      console.log('Переподключение успешно.');
    } catch (e) {
      console.error('Ошибка при переподключении:', e);
    }
  } else {
    // Все остальные ошибки просто логируем, не выходим
    console.error('Неизвестная ошибка:', err);
  }
});

// Функция для запуска бота с защитой от обрывов

console.log('Запуск бота...');
bot.on('bot_started', (ctx: any) =>
    ctx.reply('Привет! Я - официальный чат-бот Вятского агротехнологического университета.')
);
bot.on('message_created', (ctx: any) => ctx.reply('Я еще нахожусь в разработке и не могу ответить на Ваш вопрос.'));
bot.start();
console.log('Бот успешно запущен и слушает события.');
  
