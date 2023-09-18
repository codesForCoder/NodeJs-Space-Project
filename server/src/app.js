const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const planetRouter = require("./routes/planets/planets.router.js");
const launchesRouter = require("./routes/launches/launches.router.js");
const api = require("./routes/api.js");
const app = express();

//Middle Wares

//Logging framework Middleware
app.use(morgan("combined"));
//Staraigh Forward way
// app.use(cors({
//   origin : "http://localhost:3000"
// }))
//More sophistacated Way
var whitelist = [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://127.0.0.1:5500",
  "http://ec2-54-210-249-200.compute-1.amazonaws.com",
];
var corsOptions = {
  origin: function (origin, callback) {
    console.log(`Origin - ${origin}`);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); //This is Not required when Node itself is service your Frontend
app.use(express.json()); // This will parse Json if Content type is application/Json
app.use(planetRouter);
app.use(launchesRouter);
app.use("/v1", api);

//Lets run our Static site from Node app Itself - Make it last Route in secuence - So when apis not matching this is UI routes /*
//app.use(express.static(path.join(__dirname, "..", "public")));
// app.get("/*" , (req , resp)=>{
//   resp.sendFile(path.join(__dirname, "..", "public" , "index.html"))
// })

module.exports = app;
