const mongoose = require("mongoose");

const DB_SERVER_URL =process.env.MONGO_URL;
 // "mongodb+srv://nasa-api:EjhNKkfuQNSQ8Evx@atlascluster.d7ss9pi.mongodb.net/NASA_PROJECT?retryWrites=true&w=majority";
//Event emitter only Occure Once
mongoose.connection.once("open", () => {
  console.log(`Mongo Server is Connected !!!`);
});
mongoose.connection.on("error", (err) => {
  console.error(`Something bad happend on Mongo Connection `);
});

async function connectToMongo() {
  //Connect the Mongo Database

  let mongoConnectionPromise = mongoose.connect(DB_SERVER_URL);
  let resolvedOrRejectedPromise = await mongoConnectionPromise;
  console.log("************** MONGO DB CONNECTION DETAILS ******************");
  console.log(resolvedOrRejectedPromise.connections[0].db.databaseName);
  console.log("********************* END OF DETAILS *************************");
}

async function disconnectFromMongo() {
  await mongoose.disconnect();
  await mongoose.connection.close();
}

module.exports = {
  connectToMongo,
  disconnectFromMongo,
  DB_SERVER_URL
};
