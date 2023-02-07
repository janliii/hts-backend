const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "frankie1220",
  database: "hit-the-spot",
});

module.exports = pool;
