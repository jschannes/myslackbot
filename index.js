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

app.action({ action_id: 'static_select-action_env'}, async (data) => {
  await data.ack();
});

app.action({ action_id: 'static_select-action_api'}, async (data) => {
  await data.ack();
});

// Handle a view_submission event
app.view('view_1', async (data) => {
  // Acknowledge the view_submission event
  console.log(JSON.stringify(data))
  await data.ack();
})

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
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: "Demander le status"
        },
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Salut `,
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
    // console.log(result);

    // const user = user['id'];
    // console.log(view)
    // const envSelected = view['state']['values']['choose_env']['static_select-action_env']['value'];
    // const apiSelected = view['state']['values']['choose_api']['static_select-action_api']['value'];
    // const results = await db.set(user.input, envSelected)

    // console.log('resultat du form: ', apiSelected, envSelected)
    // let messageToReturn = "Trop bien biloute tu as submit un truc"
    // if( results) {
    //   messageToReturn = "J' ai reussi a recup les datas du form"
    // }else{
    //   messageToReturn = "Trop bien biloute tu as submit un truc"
     
    // }

    // await client.chat.postMessage({
    //   channel: user,
    //   text: messageToReturn
    // })
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

