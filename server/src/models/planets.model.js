const { parse } = require("csv-parse");
const { createReadStream } = require("fs");
const Planet = require("./planets.mongo");
const path = require("path");
//Stream Api will make you possible to stream data as it need
//Read a File to a readable stream  - Now you can create callbacks on fs events
const havitablePlanetArr = [];
function havitablePlanet(planet) {
  let decision =
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6;
  return decision;
}
/**
 * Sample Promise Example
 * const mypromise = new Promise((resolve , reject)=>{
 * resolve(42)
 * })
 * mypromise.then((result)=>{
 * //Will get 42
 * })
 *
 * const result = await myPromise; // This will block call
 *
 *
 */


function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration);
}

//Let this Return a Promise -- We will wait for this promise to resolve before we start the server
async function loadPlanetDataSimple() {
  return new Promise((resolve , reject)=>{
    console.log(`Starting Data fillup using Promise - loadPlanetDataSimple`);

    //Put whole Async Code here
    const readStreamIntermediate = createReadStream(
      path.join(__dirname, "..", "..", "data/kepler_data.csv")
    ); //This is the Byte Data we need to read in user redabale format
    //Send the read stream toward o writable stream
    const readStream = readStreamIntermediate.pipe(
      parse({
        comment: "#",
        columns: true,
      })
    );
    readStream.on("data", async (data) => {
      if (havitablePlanet(data)) {
          console.log(
            `Found a havitable planet - add to List - ${data.kepler_name}`
          );
          let item = {
            kepid: data.kepid,
            kepoi_name: data.kepoi_name,
            kepler_name: data.kepler_name,
          };
          await Planet.updateOne(
            {
              kepid: item.kepid,
              kepoi_name: item.kepoi_name,
              kepler_name: item.kepler_name,
            },
            item,
            { upsert: true }
          ) //This is a Promise
            .then((resolvedData) => {
              console.log(
                `Data Inserted/Updated on Planet Collections : ${JSON.stringify(
                  resolvedData
                )}`
              );
            })
            .catch((error) => {
              console.log(`Could Not save the planet - ${error}`);
            })
      }
    });

    readStream.on('end' , async ()=>{
      console.log(`Reading from File ended - Lets Add Earch Sky also `);
      let item = {
        kepid: 1122334455,
        kepoi_name: "EARTH PLANET",
        kepler_name: "Earth Sky",
      };
      await Planet.updateOne(
        {
          kepid: item.kepid,
          kepoi_name: item.kepoi_name,
          kepler_name: item.kepler_name,
        },
        item,
        { upsert: true }
      ) //This is a Promise
        .then((resolvedData) => {
          console.log(
            `Data Inserted/Updated on Planet Additionally : ${JSON.stringify(
              resolvedData
            )}`
          );
        })
        .catch((error) => {
          console.log(`Could Not save the planet Additionally - ${error}`);
        })
        delay(5000);
        console.log(`Now I am resolving the Data FillU Promise`);
        resolve(true);
    });
  });
}


function loadPlanetData() {
  return new Promise((resolve, reject) => {
    let timerTrack = new Set(); //Just to wait till all timers Finish
    //Put whole Async Code here
    const readStreamIntermediate = createReadStream(
      path.join(__dirname, "..", "..", "data/kepler_data.csv")
    ); //This is the Byte Data we need to read in user redabale format
    //Send the read stream toward o writable stream
    const readStream = readStreamIntermediate.pipe(
      parse({
        comment: "#",
        columns: true,
      })
    );

    readStream.on("data", (data) => {
      if (havitablePlanet(data)) {
        console.log("Pushing data to Plane List ");
        //Supose It take Good amount of Time to Parse and Populate Data
        let timer = setTimeout(() => {
          console.log(
            `Found a havitable planet - add to List - ${data.kepler_name}`
          );
          let item = {
            kepid: data.kepid,
            kepoi_name: data.kepoi_name,
            kepler_name: data.kepler_name,
          };
          havitablePlanetArr.push(item);
          //Now Save to Mongo DB
          //In cluster Env it can duplicate Data use Upsert
          Planet.updateOne(
            {
              kepid: item.kepid,
              kepoi_name: item.kepoi_name,
              kepler_name: item.kepler_name,
            },
            item,
            { upsert: true }
          ) //This is a Promise
            .then((resolvedData) => {
              console.log(
                `Data Inserted/Updated on Planet Collections : ${JSON.stringify(
                  resolvedData
                )}`
              );
            })
            .catch((error) => {
              console.log(`Could Not save the planet - ${error}`);
            })
            .finally(() => {
              console.log(`Operation completed !!`);
            });

          console.log(
            `Added Item to the Pre loaded List - ${JSON.stringify(item)}`
          );
          console.log(
            `Total Planets Found Till Now [Correct Answer ] - ${havitablePlanetArr.length}`
          );
          console.log(`Removing the Time - ${timer} from the List`);
          timerTrack.delete(timer);
          console.log(`Remaining Times -----------------> ${timerTrack.size}`);
          if (timerTrack.size === 0) {
            callResolveWhenFinished(havitablePlanetArr);
          }
        }, Math.floor(Math.random() * 5));
        timerTrack.add(timer);
      }
    });

    readStream.on('end' , ()=>{
      console.log(`Reading from File ended - Lets Add Earch Sky also `);
      let item = {
        kepid: 1122334455,
        kepoi_name: "EARTH PLANET",
        kepler_name: "Earth Sky",
      };
      havitablePlanetArr.push(item);
      //Now Save to Mongo DB
      //In cluster Env it can duplicate Data use Upsert
      Planet.updateOne(
        {
          kepid: item.kepid,
          kepoi_name: item.kepoi_name,
          kepler_name: item.kepler_name,
        },
        item,
        { upsert: true }
      ) //This is a Promise
        .then((resolvedData) => {
          console.log(
            `Data Inserted/Updated on Planet Additionally : ${JSON.stringify(
              resolvedData
            )}`
          );
        })
        .catch((error) => {
          console.log(`Could Not save the planet Additionally - ${error}`);
        })
        .finally(() => {
          console.log(`Operation completed Additionally !!`);
        });

    });

    /**
     * This function to call when Resolve is required post all timers Finished
     * @param {*} data
     */
    function callResolveWhenFinished(data) {
      console.log(`Now Resolve Function is being called `);
      resolve(data);
    }

    readStream.on("error", (error) => {
      console.log(`Error occured when reading File !`);
      console.log(error.message);
      reject(error); //In case Stream Error
    });

    readStream.on("close", () => {
      console.log("Stream closed !");
      console.log(
        `Total Planets Found [Wrong Answer ] - ${havitablePlanetArr.length}`
      );
    });
  }); //End of Promise Body
}
//Getting plantes from Mongo DB
async function findAllPlanets() {
  console.log(`Finding all the planets from Mongo Store using - ${Planet}`);
  // return  Planet.find({}); //This return Promise
  return await Planet.find({}, "-_id kepid kepoi_name kepler_name ");
}
//Check for change Stream 
Planet.watch().
  on('change', (data) => {
    console.log(`Getting Data from Server via watching `);
    console.log(data)});


//Module Export will Not wait for Stream to Finish - so it may happen that We will return an Empty Array rather than a Populated One

module.exports = {
  planets: havitablePlanetArr,
  planetsPromise: loadPlanetData,
  findAllPlanets :findAllPlanets,
  loadPlanetDataSimple,
};
