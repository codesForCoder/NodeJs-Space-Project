/**
 * {"launchDate":"2023-09-09T00:00:00.000Z","mission":"sasadad","rocket":"Explorer IS1","target":"Kepler-1652 b"}
 */
const Launch = require("./launches.mongo");
const Planet = require("./planets.mongo");
const axios = require("axios");

const SPACEX_POST_API = "https://api.spacexdata.com/v4/launches/query";
async function launchesPromise() {
 
 
  console.log(`Loading the Space X launch Historical Data Page by Page`);
  let startPage = 1;
  const pageSize  = 50
  while (true) {
  const response = await axios.post(SPACEX_POST_API, {
    query: {},
    options: {
      page : startPage,
        limit : pageSize,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
 if(response.status === 200){
  console.log(`Response from Space X : ===========> Page ${response.data.page}`);
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const finalCustomersList = payloads.flatMap((item) => {
      return item.customers;
    });
    const launch = {
      flightNumber: launchDoc.flight_number,
      launchDate: launchDoc.date_local,
      mission: launchDoc.name,
      customers: finalCustomersList, // customers come from payloads.customers for each payload
      upcoming: launchDoc.upcoming,
      rocket: launchDoc.rocket_name,
      target: "Earth Sky", //No applicable Value
      success: launchDoc.success,
    };
    console.log(
      `Final Launch Obj to be daved to Mongo DB - ${JSON.stringify(launch)}`
    );
    saveLaunches(launch)
  }
}else{
  console.error("Something bad happend in Api query ");
}
  if(response.data.hasNextPage){
    startPage++;
  }else{
    break;
  }
}
}

const launches = new Map();

let latestFlightNumber = 301;
const launchUpcoming = {
  flightNumber: 100, //flight_number
  launchDate: new Date("2023-09-09"), //date_local
  mission: "Kepler Exploration X", //name
  customers: ["Aniket", "Sriparna"], // customers come from payloads.customers for each payload
  upcoming: true, //upcoming
  rocket: "Explorer IS1", //rocket_name
  target: "Kepler-1652 b", //No applicable Value
  success: true, //success
};

const launchFailed = {
  flightNumber: 200,
  launchDate: new Date("2023-09-11"),
  mission: "Kepler Exploration X",
  customers: ["Aniket", "Sriparna"],
  upcoming: false,
  rocket: "Explorer IS1",
  target: "Kepler-1652 b",
  success: false,
};
const launchSuccessful1 = {
  flightNumber: 300,
  launchDate: new Date("2023-09-10"),
  mission: "Kepler Exploration X",
  customers: ["Aniket", "Sriparna"],
  upcoming: false,
  rocket: "Explorer IS1",
  target: "Kepler-1652 b",
  success: true,
};

const launchSuccessful2 = {
  flightNumber: 301,
  launchDate: new Date("2023-09-10"),
  mission: "Kepler Exploration X",
  customers: ["Aniket", "Sriparna"],
  upcoming: false,
  rocket: "Explorer IS1",
  target: "Kepler-1652 b",
  success: true,
};
// launches.set(launchUpcoming.flightNumber, launchUpcoming);
// launches.set(launchFailed.flightNumber, launchFailed);
// launches.set(launchSuccessful1.flightNumber, launchSuccessful1);
// launches.set(launchSuccessful2.flightNumber, launchSuccessful2);
//Mongo DB saves
saveLaunches(launchUpcoming);
saveLaunches(launchFailed);
saveLaunches(launchSuccessful1);
saveLaunches(launchSuccessful2);
async function saveLaunches(launchObj) {
  const planetToMatch = await Planet.findOne({
    kepler_name: launchObj.target,
  });
  console.log(
    `Matched Planet from Planet DB - ${JSON.stringify(planetToMatch)}`
  );
  if (!planetToMatch) {
    throw new Error(`Planet is Not Found - ${launchObj.target}`);
  } else {
    await Launch.updateOne(
      { flightNumber: launchObj.flightNumber },
      launchObj,
      { upsert: true }
    );
  }
}

async function getAllLaunches(page , limit) {
  return await Launch.find({}, { __v: 0, _id: 0 }).sort({flightNumber: -1}).skip(limit*(page-1)).limit(limit);
}

async function existsLaunch(launchId) {
  console.log(`Checking if Launch is already scheduled for Id - ${launchId}`);
  const result = await Launch.findOne({
    flightNumber: launchId,
    upcoming: true,
  });
  const decision = result ? true : false;
  console.log(`Is the Flight scheduled for Id : ${launchId} | ==>${decision}`);
  return decision;
  // return launches.has(launchId);
}

async function abortLaunch(launchId) {
  console.log(`Aborting launch with Id- ${launchId}`);
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  //console.log(`Launch to be aborted - ${JSON.stringify(aborted)}`);
  const aborted = await Launch.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false },
    { upsert: false }
  );
  console.log(`aborted  --- ${JSON.stringify(aborted)}`);
  return aborted;
}

async function findLatestFlightNumber() {
  const latestFlight = await Launch.findOne().sort("-flightNumber");
  console.log(`Retrived the latest flight with height Flight Number `);
  console.log(latestFlight);
  if (!latestFlight) {
    return latestFlightNumber;
  } else {
    return latestFlight.flightNumber + 1;
  }
}
async function addNewLaunch(launch) {
  console.log(`Adding New Launch !! `);
  //launch["flightNumber"] = latestFlightNumber+1;
  //Or you can use Object.assign if you need multiple thing to be updated
  const planetToMatch = await Planet.findOne({
    kepler_name: launch.target,
  });
  console.log(
    `Matched Planet from Planet DB - ${JSON.stringify(planetToMatch)}`
  );
  if (!planetToMatch) {
    throw new Error(`Planet is Not Found - ${launch.target}`);
  } else {
    const latestNum = await findLatestFlightNumber();

    console.log(`Latest assigned Flight Number - ${latestNum}`);
    launch = Object.assign(launch, {
      customers: ["Aniket", "Sriparna"],
      upcoming: true,
      success: true,
      flightNumber: latestNum, //++latestFlightNumber,
    });
    // launches.set(launch.flightNumber, launch);
    const launchId = (
      await Launch.updateOne({ flightNumber: launch.flightNumber }, launch, {
        upsert: true,
      })
    ).upsertedId;
    const result = Launch.findById({ _id: launchId }, { __v: 0, _id: 0 });
    console.log(`Launch has been added !!! - ${result}`);
    return result;
  }
}
module.exports = {
  launchesPromise,
  launches: launches,
  addNewLaunch,
  existsLaunch,
  abortLaunch,
  getAllLaunches,
};
