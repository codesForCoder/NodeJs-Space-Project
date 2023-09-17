require('dotenv').config();
const request = require("supertest");
const app = require("../../app.js");
const { response } = require("express");
const {
  disconnectFromMongo,
  connectToMongo,
} = require("../../Appservices/mongoConfig.js");

describe("Preparing Env for testing ", () => {
  beforeAll( (done) => {
    console.log(
      `*************** STARTING AT THE BEGINNING OF ALL TESTES *****************`
    );
     connectToMongo().then((resolved)=>{
      done();
     });
  });

  afterAll( (done) => {
    console.log(
      `*************** ENDING AT THE END OF ALL TESTES *****************`
    );
     disconnectFromMongo().then((resolvedData)=>{
      done();
     });
  });

  //No need to Import Jest know about this packages
  describe("Test GET /launches", () => {
    test("It shoud respond with 200 status code", async () => {
      //Write actual test case here
      const response = await request(app)
        .get("/launches")
        .set("Origin", "http://localhost:8000"); //Setting Header
      //const response = 200;
      expect(response.status).toBe(200);

      //We can do alternative way also Directly checking via supertest chain
      request(app)
        .get("/launches")
        .set("Origin", "http://localhost:8000")
        .expect(200); //Setting Header
    });
  });

  describe("Test POST /launches", () => {
    test("It shoud respond with 201 status code", async () => {
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
  });

  describe("Test POST /launches", () => {
    test("It shoud respond with 201 status code yload validation", async () => {
      //We can do alternative way also Directly checking via supertest chain
      let resp = await request(app)
        .post("/launches")
        .set("Origin", "http://localhost:8000")
        .send({
          launchDate: "2023-09-10",
          mission: "Kepler Exploration X",
          rocket: "Explorer IS1",
          target: "Kepler-1652 b",
        })
        .expect(201);

      expect(resp.body).toMatchObject({
        mission: "Kepler Exploration X",
        rocket: "Explorer IS1",
        target: "Kepler-1652 b",
      });
    });
  });

  describe("Test POST /launches", () => {
    test("It shoud respond with 400 status code", async () => {
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
  });
});
