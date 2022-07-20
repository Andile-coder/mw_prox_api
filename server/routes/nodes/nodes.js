const pool = require("../../config/config.js");
const nodes = require("../../../App/data/nodes.json");

const postNode = async (nodes) => {
  //get clusterid
  const query = `select * from clusters where name='${nodes.clientId}'`;
  const clientId = await pool
    .query(query)
    .then((response) => response.rows[0].clusterid)
    .catch((err) => console.log(err));

  console.log(clientId);
  nodes.nodes.data.forEach(async (element) => {
    const query = `INSERT INTO Nodes (clusterid,nodename,status) VALUES($1,$2,$3)`;
    await pool
      .query(query, [clientId, element.node, element.status])
      .then(() => console.log("node added"))
      .catch((error) => console.log(error));
  });
};

module.exports = { postNode };
