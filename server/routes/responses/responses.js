const pool = require("../../config/config.js");
const postResponse = async (data, quer, id) => {
  const clusterQueryId = `SELECT clusterid from clusters where name='${id}'`;
  const clusterid = await pool
    .query(clusterQueryId)
    .then((data) => data.rows[0]?.clusterid)
    .catch((erro) => console.log(erro));
  const loadtime = new Date();
  const responseQuery = quer;
  const res = JSON.stringify(data);
  const query =
    "INSERT INTO responses (loadtime,clusterid,query,response) VALUES($1,$2,$3,$4)";
  await pool
    .query(query, [loadtime, clusterid, responseQuery, res])
    .then(() => console.log("query added to response table"))
    .catch((error) => console.log(error));
};

module.exports = { postResponse };
