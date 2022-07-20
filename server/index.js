const instances = require("./routes/instances/instances.js");
const node = require("./routes/nodes/nodes.js");
const cluster = require("./routes/clusters/clusters.js");

const clusters = require("../App/data/cluster.json");
const nodes = require("../App/data/nodes.json");
const qemu = require("../App/data/vms.json");
const lxc = require("../App/data/containers.json");

const populateDataBase = async () => {
  //   await cluster.postCluster();
  //   await node.postNode();
  await instances.postVms(lxc);
  //   await instances.postVms(qemu);
};

populateDataBase();
