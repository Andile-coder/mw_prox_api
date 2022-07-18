const { Pool } = require("pg");
const pool = new Pool({
  user: "andilemasela",
  host: "localhost",
  database: "mw_prox",
  password: "Masela@2000",
  port: 5432,
});

module.exports = pool;
