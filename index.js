require("dotenv").config();
const { Client, Intents } = require("discord.js");
const rp = require("request-promise");

const { DISCORD_BOT_TOKEN, COINMARKET_API } = process.env;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const COIN_SYMBOL = "PVU";
const COIN_CURRENCY = "BRL";
const requestOptions = {
  method: "GET",
  uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
  qs: {
    convert: COIN_CURRENCY,
    symbol: COIN_SYMBOL,
  },
  headers: {
    "X-CMC_PRO_API_KEY": COINMARKET_API,
  },
  json: true,
  gzip: true,
};

client.on("ready", () => {
  rp(requestOptions)
    .then((response) => {
      const { data } = response;

      const coin_info = {
        name: data[COIN_SYMBOL].name,
        price: data[COIN_SYMBOL]["quote"][COIN_CURRENCY].price,
      };

      client.user.setActivity(
        `${COIN_SYMBOL} a ${coin_info.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: COIN_CURRENCY,
        })}`,
        { type: "PLAYING" }
      );
    })
    .catch((err) => {
      console.log("API call error:", err.message);
    });
});

client.login(DISCORD_BOT_TOKEN);