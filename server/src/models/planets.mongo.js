const mongoose = require("mongoose");
//Mongo db interactions
/**
 * {
            "kepid": "11768142",
            "kepoi_name": "K02626.01",
            "kepler_name": "Kepler-1652 b"
        }
 */

const planetSchema = new mongoose.Schema({
  // flightNumber: Number,
  kepid: {
    type: Number,
    required: true,
  },
  kepoi_name: {
    type: String,
    required: true,
  },
  kepler_name: {
    type: String,
    required: true,
  }
});

const Planet =  mongoose.model('Planet',planetSchema);
console.log(`Planet Model - ${Planet}`);
module.exports = Planet;