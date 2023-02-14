require("dotenv").config();

const Pool = require("pg").Pool;
const connectionString = process.env.DATABASE_URL;

// const DATABASE_URL =
//   "postgresql://postgres:frankie1220@localhost:5432/hit-the-spot";
const pool = new Pool({
  connectionString,
  // ssl: {
  //   // require: true,
  //   rejectUnauthorized: false,
  // },
});

module.exports = pool;
