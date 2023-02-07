require("dotenv").config();

const { Pool, Client } = require("pg");
// const DATABASE_URL =
//   "postgresql://postgres:frankie1220@localhost:5432/hit-the-spot";
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
const client = new Client({
  connectionString,
});
client.connect();

// pool.connect();

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "frankie1220",
//   database: "hit-the-spot",
// });

module.exports = pool;
