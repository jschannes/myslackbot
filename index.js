const { App } = require('@slack/bolt');
const axios = require('axios');

const dotenv = require('dotenv')
dotenv.config()


const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.event('app_mention', async ({ context, event }) => {
  try{
    if(event.text.includes(' random tip')) {
      await randomTip(context.botToken, event.channel)
    } else if(event.text.includes(' random joke')) {
      await randomJoke(context.botToken, event.channel)
    } else if(event.text.includes(' hello')) {
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `Hello <@${event.user}>`
      })
    } else if(event.text.includes(' help')) {
      await runHelp(context.botToken, event.channel)
    } else {
      await runDefault(context.botToken, event.channel)
    }
  }
  catch (e) {
    console.log(`error responding ${e}`);
  }

});

function randomTip(token, channel) {
  axios.get('https://raw.githubusercontent.com/jschannes/myslackbot/main/tip.json')
  .then(res => {
    const tips = res.data;
    const random = Math.floor(Math.random() * tips.length);
    const tip = tips[random].tip
    const author = tips[random].author

    app.client.chat.postMessage({
      token: token,
      channel: channel,
      text: `:heart: ${tip} - *${author}*`
    })
  })
}

function randomJoke(token, channel) {
  axios.get('https://api.chucknorris.io/jokes/random')
    .then(res => {
      const joke = res.data.value;
      
      app.client.chat.postMessage({
        token: token,
        channel: channel,
        text: `:zap: ${joke}`
      })
    })
}

function runHelp(token, channel) {
  app.client.chat.postMessage({
    token: token,
    channel: channel,
    text: `Type *@myslackbot* with *random tip* to get a tip, *random joke* to get a Chuck Norris random joke and *help* to get this instruction again`
  })
}

function runDefault(token, channel) {
  app.client.chat.postMessage({
    token: token,
    channel: channel,
    text: `Type *@myslackbot* with *help* to get more instructions`
  })
}

app.action({ action_id: 'static_select-action_env'}, async (data) => {
  await data.ack();
});

app.action({ action_id: 'static_select-action_api'}, async (data) => {
  await data.ack();
});

// Listen for a slash command invocation
app.command('/server_status', async ({ ack, body,view, client, user }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_form_status',
        title: {
          type: 'plain_text',
          text: "Demander le status"
        },
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Salut  `,
              emoji: true
            }
          },
          {
            type: "section",
            block_id:"choose_env",
            text: {
              type: "mrkdwn",
              text: "Pour quel envirronnement ?"
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "env",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "DEV",
                    emoji: true
                  },
                  value: "dev"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "QLF",
                    emoji: true
                  },
                  value: "qlf"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "PPROD",
                    emoji: true
                  },
                  value: "pprod"
                }
              ],
              action_id: "static_select-action_env"
            }
          },
          {
            type: "section",
            block_id:"choose_api",
            text: {
              type: "mrkdwn",
              text: "Pour quel API ?"
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "api",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Cart",
                    emoji: true
                  },
                  value: "cart"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Promise",
                    emoji: true
                  },
                  value: "promise"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Payment",
                    emoji: true
                  },
                  value: "payment"
                }
              ],
              action_id: "static_select-action_api"
            }
          },
          
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('view_form_status', async ({ ack, body, view, client, context }) => {
  // Acknowledge the view_submission event
  await ack();

  const user = body['user']['id'];
  const envSelected = view['state']['values']['choose_env']['static_select-action_env']['selected_option']['text']['text'];
  const apiSelected = view['state']['values']['choose_api']['static_select-action_api']['selected_option']['text']['text'];

  let msg = "test"
  if (envSelected) {
    msg = `You choose env ${envSelected}`;
  }
  
  if (envSelected && apiSelected) {
    msg += ` end choose api ${apiSelected}`;
  } else {
    if( apiSelected)
    {
      msg = `You choose api ${apiSelected}`;
    }
  }

  try {
    await client.chat.postMessage({
      channel: user,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

