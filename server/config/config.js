const { Pool } = require("pg");
const pool = new Pool({
  user: "clouduser",
  host: "localhost",
  database: "mw_prox_api",
  password: "clouduser",
  port: 5432,
});

module.exports = pool;
