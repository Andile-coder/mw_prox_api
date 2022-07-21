const { Pool } = require("pg");
const pool = new Pool({
  user: "andile-ubnt2004",
  host: "localhost",
  database: "mw_prox",
  // password: "Masela@2000",
  port: 5432,
});

module.exports = pool;
