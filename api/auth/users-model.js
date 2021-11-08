const db = require("../../data/dbConfig.js");

function getId() {
  return nanoid().slice(0, 5)
}

function findById(id) {
  const [id] = await Users
}

async function add(user) {
  const [id] = await jokesData("users").insert(user, "id")
  return findById(id)
}

function findBy(filter) {
  return 
}

module.exports = {
  add,
  findBy
}