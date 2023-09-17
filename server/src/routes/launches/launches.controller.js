// Its better to Package Router and Contoleer in same package
const { launches, addNewLaunch ,existsLaunch ,abortLaunch , getAllLaunches } = require("../../models/launches.model.js"); //Here Map is an Object - Better to Use Destructuring
const { param } = require("./launches.router.js");

async function getAllLaunchesFromDB(req, resp) {
  // return resp.status(200).json(Array.from(launches.values()));
 const params = req.query;
 console.log(`Received Query Params for pagination - ${JSON.stringify(params)}`);
 let page =parseInt(params ? (params.page? params.page : 1):(1));
 page = isNaN(page) ?  1 : page;
 let limit = parseInt(params? (params.limit?  params.limit : 1000):(1000));
 limit = isNaN(limit) ? 1000 : limit;
 
 console.log(`Asking Data for Page : ${page} | Limit ${limit}`);
  getAllLaunches(page,limit).then((resolvedData)=>{
    console.log("Data Received from Mongo Server ");
   // console.log(resolvedData);
    return resp.status(200).json( resolvedData);
   });
}

function httpAddNewLaunches(req, resp) {
  const launch = req.body;
  //Check if payload is present in the  Body 
  if(!launch || !launch.launchDate || !launch.mission || !launch.rocket|| !launch.target){
    return resp.status(400).json(
      {error : 'Missing something in payload',
        actualRequest : launch});
 
  }else {

    console.log(`Received Request - ${JSON.stringify(launch)}`);
    let launchDate = new Date(launch.launchDate);
    //Check if Date is Good Format or Not 
    //Generally Javascript convert Date to Number 
    if(isNaN(launchDate)){
      return resp.status(400).json(
        {error : 'Launch Date is Missing ',
          actualRequest : launch});
    }else {
      launch.launchDate = launchDate;
      addNewLaunch(launch).then(resolveData =>{
        return resp.status(201).json(resolveData);
      }).catch(err=>{
        return resp.status(500).json(
          {error : err.message});
      }) ;
     
    }
   
  }
 
}

async function httpAbortLaunches(req , resp ){
  let launchId = req.params.id;
  console.log(`Got the Id for aborting Launch - ${launchId}`);
    if(isNaN(parseInt(launchId)) || isNaN(Number(launchId))){
      //Validation error 
      return resp.status(400).json(
        {error : 'Launch Id is invalid',
          actualId : req.params.id});
    }else{
       launchId = Number(req.params.id);
        if(await existsLaunch(launchId)){
       //If launch Id is Found and Aborted 
       let aborted = await  abortLaunch(launchId)
       if(aborted.modifiedCount === 1 ){
        return resp.status(200).json({msg : "Launch is Aborted"});
       }else{
        return resp.status(400).json( {error : 'Launch Id Not Valid | Launch Not aborted',
        actualId : launchId});
       }
     
        }else{
       //If lunch Id not Found 
       return resp.status(404).json(
        {error : 'Launch Id Not Found',
          actualId : launchId});
       }
    }
}
module.exports = {
  getAllLaunchesFromDB,
  httpAddNewLaunches,
  httpAbortLaunches,
};
