require("dotenv").config();
const { Client, Intents } = require("discord.js");
const rp = require("request-promise");

const { DISCORD_BOT_TOKEN, COIN_ID } = process.env;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const COIN_CURRENCY = "BRL";
const MS_INTERVAL = 10000;
const requestOptions = {
  method: "GET",
  uri: `https://api.coingecko.com/api/v3/coins/${COIN_ID}`,
  json: true,
  gzip: true,
};

client.on("ready", () => {
  setInterval(() => {
    rp(requestOptions)
      .then(({ symbol, market_data }) => {

        client.user.setActivity(
          `${symbol.toUpperCase()} a ${market_data.current_price.brl.toLocaleString("pt-BR", {
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
