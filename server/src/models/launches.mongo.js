//Mongo db interactions
const mongoose = require("mongoose");

/**
 *  {
  flightNumber: 200,
  launchDate: new Date("2023-09-11"),
  mission: "Kepler Exploration X",
  customers: ["Aniket", "Sriparna"],
  upcoming: false,
  rocket: "Explorer IS1",
  target: "Kepler-1652 b",
  success: false,
}
 */

const launchSchema = new mongoose.Schema({
  // flightNumber: Number,
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  //Need to code ourself - Better to Use No Sql Approach
  // target: {
  //   ref : 'Planet',
  //   type: mongoose.ObjectId,
  //   required: true,
  // },
  target: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
    required: true,
  },
});



//Creating Model 
//Document name shoud be Singular name -
// Mongoose will connect to a plural Name collection 

const Launch = mongoose.model('Launch',launchSchema);
console.log(`Launch Model - ${Launch}`);
module.exports = Launch;
