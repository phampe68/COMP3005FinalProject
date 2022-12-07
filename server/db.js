const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "student",
  host: "localhost",
  port: 5433,
  database: "bookstore"
});


module.exports = pool;