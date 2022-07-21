const { Pool } = require("pg");
const pool = new Pool({
  user: "andile-ubnt2004",
  host: "localhost",
  database: "mw_prox",
  password: "",
  port: 5432,
});

module.exports = pool;
