const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "p@ssw0rd",
  host: "localhost",
  port: 5432,
  database: "bookstore"
});


module.exports = pool;