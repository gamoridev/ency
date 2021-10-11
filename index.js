require("dotenv").config();
const { Client, Intents } = require("discord.js");
const rp = require("request-promise");
const http = require("http");

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
      .then(({ market_data }) => {
        const price = market_data.current_price.brl.toLocaleString("pt-BR", {
          style: "currency",
          currency: COIN_CURRENCY,
        });

        const percent_24h = market_data.price_change_percentage_24h;
        const arrow = percent_24h > 0 ? "↗" : "↘";

        client.user.setActivity(
          `${price} ${arrow} ${percent_24h.toFixed(2)}%`,
          {
            type: "PLAYING",
          }
        );
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }, MS_INTERVAL);
});

client.login(DISCORD_BOT_TOKEN);

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("ok");
});
server.listen(3000);
