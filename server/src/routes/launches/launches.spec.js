require("dotenv").config();
const request = require("supertest");
const app = require("../../app.js");
const {
  disconnectFromMongo,
  connectToMongo,
  DB_SERVER_URL,
} = require("../../Appservices/mongoConfig.js");
const { loadPlanetDataSimple } = require("../../models/planets.model.js");
describe("Launches API", () => {
  //************************************************ */
  beforeAll(async () => {
    await connectToMongo();
    await loadPlanetDataSimple(); //Can only be called from Async Function
    console.log(`TEST CASE WILL BE RUNNING ON DB - ${DB_SERVER_URL}`);
  });
  //************************************************ */
  afterAll(async () => {
    await disconnectFromMongo();
  });
  //************************************************ */
  //No need to Import Jest know about this packages
  describe("Test GET /launches", () => {
    test("Test GET /launches : It shoud respond with 200 status code", async () => {
      //Write actual test case here
      const response = await request(app)
        .get("/launches")
        .set("Origin", "http://localhost:8000"); //Setting Header
      //const response = 200;
      expect(response.status).toBe(200);

      //We can do alternative way also Directly checking via supertest chain
      // request(app)
      //   .get("/launches")
      //   .set("Origin", "http://localhost:8000")
      //   .expect(200); //Setting Header
    });
  });
  //************************************************ */
  describe("Test POST /launch", () => {
    test("Test POST /launches : It shoud respond with 201 status code", async () => {
      //We can do alternative way also Directly checking via supertest chain
      const response = await request(app)
        .post("/launches")
        .set("Origin", "http://localhost:8000")
        .send({
          launchDate: "2023-09-10",
          mission: "Kepler Exploration X",
          rocket: "Explorer IS1",
          target: "Kepler-1652 b",
        });
      console.log(response.text);
      expect(response.status).toBe(201);
    });

    //----------------------------------------------------------

    test("Test POST /launches : It shoud respond with 400 status code", async () => {
      //We can do alternative way also Directly checking via supertest chain
      const response = await request(app)
        .post("/launches")
        .set("Origin", "http://localhost:8000")
        .send({
          mission: "Kepler Exploration X",
          rocket: "Explorer IS1",
          target: "Kepler-1652 b",
        })
        .expect(400);
      console.log(response.text);
      expect(response.text).toStrictEqual(
        '{"error":"Missing something in payload","actualRequest":{"mission":"Kepler Exploration X","rocket":"Explorer IS1","target":"Kepler-1652 b"}}'
      );
    });
    //--------------------------------------------------------------
  });
});
