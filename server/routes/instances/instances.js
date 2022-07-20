const pool = require("../../config/config.js");
const vms = require("../../../App/data/vms.json");
const lxc = require("../../../App/data/containers.json");
const getAllInstances = (req, res) => {
  const query = "SELECT * FROM instances";
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

const postVms = async (instances) => {
  instances.forEach(async (vm) => {
    const nodeQuery = `SELECT NODEID,clusterid FROM NODES WHERE NODENAME='${vm.node}'`;
    const nodeId = await pool
      .query(nodeQuery)
      .then((data) => data.rows[0].nodeid)
      .catch((err) => console.log(err));

    const clusterId = await pool
      .query(nodeQuery)
      .then((data) => data.rows[0].clusterid)
      .catch((err) => console.log(err));

    const query =
      "INSERT INTO instances (vmid,name,node_id,intancetype,cores,memory,status,pool,networks,storage,clusterid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
    pool
      .query(query, [
        vm.vmid,
        vm.name || vm.hostname,
        nodeId,
        vm.type,
        vm.cores,
        vm.memory,
        vm.status,
        vm.pool[0],
        JSON.stringify(vm.networks),
        JSON.stringify(vm.Storage),
        clusterId,
      ])
      .then(() => console.log("instance added"))
      .catch((error) => console.log(error));
  });
};

// postVms(lxc);
// postVms(vms);
module.exports = { postVms };
