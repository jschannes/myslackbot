const { App } = require('@slack/bolt');

const dotenv = require('dotenv')
dotenv.config()


const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.event('app_mention', async ({ context, event }) => {

  try{
    await app.client.chat.postMessage({
    token: context.botToken,
    channel: event.channel,
    text: `Hey yoo <@${event.user}>`
  });
  }
  catch (e) {
    console.log(`error responding ${e}`);
  }

});

app.message('hello', async ({ message, say }) => {
  console.log(message)
  await say(`Salut`);
});

app.command('/echo', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`${command.text}`);
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

