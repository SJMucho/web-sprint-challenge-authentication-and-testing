const db = require("../../data/dbConfig.js");

function getId() {
  return nanoid().slice(0, 5);
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}

function findById(id) {
  return db("users").where({ id }).first();
}

function findBy(filter) {
  return;
}

module.exports = {
  add,
  findBy,
};
