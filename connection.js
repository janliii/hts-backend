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

// const connectionString = process.env.HEROKU_POSTGRESQL_TEAL_URL;

// if (process.env.HEROKU_POSTGRESQL_TEAL_URL) {
//   const pool = new Pool({
//     connectionString: process.env.HEROKU_POSTGRESQL_TEAL_URL,
//     ssl: true,
//   });
// } else {
//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
// }
// module.exports = pool;
// client.connect();

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "frankie1220",
//   database: "hit-the-spot",
// });
