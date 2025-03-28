const { Client, logger } = require('./lib/client');
const { DATABASE, VERSION, ALWAYS_ONLINE, ALWAYS_TYPING, AUTO_STATUS_VIEW, SEND_READ, CMD_REACTION, REJECT_CALL } = require('./config');
const { stopInstance } = require('./lib/pm2');

// Emoji sets
const STATUS_REACTIONS = ["☘️", "🍀", "🌿", "🌷", "⚘️", "🎉"];
const RANDOM_REACTIONS = ["🦓", "🐆", "🐅", "🐈"];

// Function to handle bot features
const setupBotFeatures = (bot) => {
  if (ALWAYS_ONLINE === 'true') {
    logger.info('Setting bot status to always online...');
    bot.setPresence({ status: 'online' });
  }

  if (ALWAYS_TYPING === 'true') {
    logger.info('Setting bot status to always typing...');
    setInterval(() => {
      bot.sendTypingStatus();
    }, 5000);
  }

  if (AUTO_STATUS_VIEW === 'true') {
    logger.info('Auto status view feature enabled.');
    bot.on('statusUpdate', (status) => {
      bot.viewStatus(status);
      
      // React with a random emoji to viewed statuses
      const reaction = STATUS_REACTIONS[Math.floor(Math.random() * STATUS_REACTIONS.length)];
      bot.reactToStatus(status, reaction);
      logger.info(`Reacted to status with: ${reaction}`);
    });
  }

  if (SEND_READ === 'true') {
    logger.info('Enabling read receipts...');
    bot.on('message', (msg) => {
      bot.sendReadReceipt(msg);
    });
  }

  if (CMD_REACTION === 'true') {
    logger.info('Enabling command reactions...');
    bot.on('commandExecuted', (cmd) => {
      bot.reactToCommand(cmd);
    });
  }

  if (REJECT_CALL === 'true') {
    logger.info('Rejecting incoming calls...');
    bot.on('incomingCall', (call) => {
      bot.rejectCall(call);
    });
  }

  // Random message reactions
  bot.on('message', (msg) => {
    if (!msg.isCommand) {
      const reaction = RANDOM_REACTIONS[Math.floor(Math.random() * RANDOM_REACTIONS.length)];
      bot.reactToMessage(msg, reaction);
      logger.info(`Reacted to message with: ${reaction}`);
    }
  });
};

// Main bot startup function
const start = async () => {
  logger.info(`Levanter bot version ${VERSION} is starting...`);

  try {
    await DATABASE.authenticate({ retry: { max: 3 } });
    logger.info('Database connection successful.');
  } catch (error) {
    const databaseUrl = process.env.DATABASE_URL;
    logger.error({ msg: 'Unable to connect to the database', error: error.message, databaseUrl });
    return stopInstance();
  }

  try {
    const bot = new Client();
    setupBotFeatures(bot);
    await bot.connect();
    logger.info('Bot connected successfully.');
  } catch (error) {
    logger.error({ msg: 'Error initializing the bot client', error: error.message });
  }
};

// Start the bot
start();
