let configPath = Boolean(process.env.NODE_ENV)
  ? ".env." + process.env.NODE_ENV
  : ".env";
console.log(`Config Pth : - ${configPath}`);
require("dotenv").config({
  dotenv_config_path: configPath,
  dotenv_config_debug: true,
});
//This above will Pick .env when Nothing is supplied
console.log(process.env.RUN_ENV);
const http = require("http");
const app = require("./app.js");
const { connectToMongo } = require("../src/Appservices/mongoConfig.js");
const { planetsPromise } = require("./models/planets.model");
const { launchesPromise } = require("./models/launches.model");
//Accessing the Server port from Argument
const PORT = process.env.PORT;
console.log(`Application will be Running on Server PORT - ${PORT}`);

//Another way to create Server Using Express

const server = http.createServer(app); //Here express is Our Listner Function Callback

async function startServer() {
  /**
   * We can either use Promise Then Catch Finally chain Or use Await inside async to get the result
   */
  //Calloing Mongo Connect
  connectToMongo();
  //Now we will wait Until the Data get loaded fully
  let populatedInitPlanets = await planetsPromise(); //Can only be called from Async Function
  populatedInitPlanets.forEach((element) => {
    console.log(
      `Planet Loaded as Pre Init Script - ${JSON.stringify(element)}`
    );
  });
  await launchesPromise(); //Loading Launchh Data from space X api
  server.listen(PORT, () => {
    console.log(`Server started at Port : ${PORT}`);
  });
}

startServer();

//express is just a fansy Listenr Function for our Node Built in Server

/**
 * This way of creating server support us to use Websocket , Http etc together
 * Express and Server Functions are seperated
 */
