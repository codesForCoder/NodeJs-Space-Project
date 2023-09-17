// Its better to Package Router and Contoleer in same package
const {planets ,findAllPlanets} = require("../../models/planets.model"); //Objects like array and all cannot be imported using {}

function getAllPlanets(req, resp) {
 // return resp.status(200).json({"planets" : planets});
  findAllPlanets().then((resolvedData)=>{
   console.log(resolvedData);
   return resp.status(200).json({"planets" : resolvedData});
  });
}

module.exports = {
  getAllPlanets,
};
