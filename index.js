const { Client, logger } = require('./lib/client');
const { DATABASE, VERSION, ALWAYS_ONLINE, ALWAYS_TYPING, AUTO_STATUS_VIEW, SEND_READ, CMD_REACTION, REJECT_CALL } = require('./config');
const { stopInstance } = require('./lib/pm2');

// Function to handle bot features like always online, always typing, and auto status view
const setupBotFeatures = (bot) => {
  if (ALWAYS_ONLINE === 'true') {
    logger.info('Setting bot status to always online...');
    // Implement bot logic to keep it online, e.g., using `setPresence` or equivalent
    bot.setPresence({ status: 'online' });
  }

  if (ALWAYS_TYPING === 'true') {
    logger.info('Setting bot status to always typing...');
    // Implement bot logic to keep the typing status active, e.g., periodic typing
    setInterval(() => {
      bot.sendTypingStatus(); // Hypothetical function to simulate typing
    }, 5000); // Adjust typing interval as needed
  }

  if (AUTO_STATUS_VIEW === 'true') {
    logger.info('Auto status view feature enabled.');
    // Implement auto status view logic
    bot.on('statusUpdate', (status) => {
      bot.viewStatus(status); // Hypothetical function to automatically view status
    });
  }

  if (SEND_READ === 'true') {
    logger.info('Enabling read receipts...');
    // Enable read receipts for messages if SEND_READ is true
    bot.on('message', (msg) => {
      bot.sendReadReceipt(msg);
    });
  }

  if (CMD_REACTION === 'true') {
    logger.info('Enabling command reactions...');
    // Add logic to automatically react to commands with specific emojis or feedback
    bot.on('commandExecuted', (cmd) => {
      bot.reactToCommand(cmd); // Hypothetical function to react with an emoji
    });
  }

  if (REJECT_CALL === 'true') {
    logger.info('Rejecting incoming calls...');
    // Automatically reject calls if REJECT_CALL is true
    bot.on('incomingCall', (call) => {
      bot.rejectCall(call);
    });
  }
};

// Main bot startup function
const start = async () => {
  logger.info(`Levanter bot version ${VERSION} is starting...`);

  try {
    // Attempt to connect to the database with retries
    await DATABASE.authenticate({ retry: { max: 3 } });
    logger.info('Database connection successful.');
  } catch (error) {
    const databaseUrl = process.env.DATABASE_URL;
    logger.error({ msg: 'Unable to connect to the database', error: error.message, databaseUrl });
    return stopInstance();
  }

  try {
    // Initialize and connect the bot client
    const bot = new Client();

    // Setup features like Always Online, Always Typing, etc.
    setupBotFeatures(bot);

    // Start the bot connection
    await bot.connect();
    logger.info('Bot connected successfully.');

    // Optionally add more features like auto status viewing, random reactions, etc.
  } catch (error) {
    logger.error({ msg: 'Error initializing the bot client', error: error.message });
  }
};

// Start the bot
start();
