const Users = require("./users-model")
const db = require("../../data/dbConfig")

const moira = {name:"Moira"}

beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async ()=>{
  await db("users").truncate()
})
afterAll(async ()=>{
  await db.destroy()
})
it("correct env",()=>{
  expect(process.env.DB_ENV).toBe("testing")
})


describe("Users Model", ()=>{
  describe("insert function",()=>{
    it("added user to db", async ()=>{
      let all 
      await Users.insert(moira)
      all = await db("users")
      expect(all).toHaveLength(1)
    })
  })
})