const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "student",
  host: "localhost",
  port: 5432,
  database: "bookstore"
});


module.exports = pool;