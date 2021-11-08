// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig.js");
const endPoints = require("./auth/auth-router");

// test('sanity', () => {
//   expect(true).toBe(false)
// })

const pedro = { username: "Pedro" };
const moira = { username: "Moira" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

// describe("endPoints", () => {
//   describe("[POST] /register", () => {
//     it("responds with new user", async () => {
//       let res;
//       res = await (await request(endPoints).post("/register")).send(moira);
//       expect(res.body).toMatchObject({ id: 3, ...Moira });
//     });
//   });
// });
