const { Pool } = require("pg");
const pool = new Pool({
  user: "clouduser",
  host: "localhost",
  database: "clouduser",
  password: "andile-ubnt2004",
  port: 5432,
});

module.exports = pool;
