require("dotenv").config();
const { Client, Intents } = require("discord.js");
const rp = require("request-promise");

const { DISCORD_BOT_TOKEN, COIN_NAME, COINMARKET_API } = process.env;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const COIN_CURRENCY = "BRL";
const MS_INTERVAL = 10000;
const requestOptions = {
  method: "GET",
  uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
  qs: {
    convert: COIN_CURRENCY,
    symbol: COIN_NAME,
  },
  headers: {
    "X-CMC_PRO_API_KEY": COINMARKET_API,
  },
  json: true,
  gzip: true,
};

client.on("ready", () => {
  setInterval(() => {
    rp(requestOptions)
      .then((response) => {
        const { data } = response;

        const coin_info = {
          name: data[COIN_NAME].name,
          price: data[COIN_NAME]["quote"][COIN_CURRENCY].price,
        };

        client.user.setActivity(
          `${COIN_NAME} a ${coin_info.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: COIN_CURRENCY,
          })}`,
          { type: "PLAYING" }
        );
      })
      .catch((err) => {
        console.log("API call error:", err.message);
      });
  }, MS_INTERVAL);
});

client.login(DISCORD_BOT_TOKEN);
