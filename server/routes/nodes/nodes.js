const pool = require("../../config/config.js");
const nodes = require("../../../App/data/nodes.json");

const postNode = async (req, res) => {
  //get clusterid
  const query = `select * from clusters where name='${nodes.clientId}'`;
  const clientId = await pool
    .query(query)
    .then((response) => response.rows[0])
    .catch((err) => console.log(err));
  nodes.nodes.data.forEach(async (element) => {
    const query = `INSERT INTO Nodes (clusterid,nodename,status) VALUES($1,$2,$3)`;
    await pool
      .query(query, [clientId[0]?.clusterid, element.node, element.status])
      .then(() => console.log("node added"))
      .catch((error) => console.log(error));
  });
};

postNode();
module.exports = { getAllNodes, postNode };
