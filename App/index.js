const pve = require("@corsinvest/cv4pve-api-javascript");
const createJsonFile = require("./createFile");
const getNets = require("./netsDictionary");
const getStorage = require("./storageDictionary");
const clusters = require("./clusters.json");
const ClusterRoute = require("../server/routes/clusters/clusters.js");
const NodesRoute = require("../server/routes/nodes/nodes.js");
const InstancesRoute = require("../server/routes/instances/instances.js");
const ResponseRoute = require("../server/routes/responses/responses.js");
const Populate = async (clusters) => {
  await clusters.forEach(async (Cluster) => {
    const clientId = Cluster.clusterId;
    const username = Cluster.username;
    const password = Cluster.password;
    const auth = Cluster.auth;
    const client = new pve.PveClient(clientId, 8006);
    const login = await client.login(username, password, auth);
    if (login) {
      console.log("login", login);
      const configuredQemu = [];
      const configuredLxc = [];
      const configuredPools = [];
      ClusterRoute.postCluster(Cluster);
      //get nodes
      let nodes = (await client.nodes.index()).response;
      const nodesQ = `/nodes`;

      ResponseRoute.postResponse(nodes, nodesQ, clientId);

      //get vm via clusters
      let cluster = (await client.cluster.resources.resources("vm")).response;
      const clusterQ = `/cluster/resources/`;
      ResponseRoute.postResponse(nodes, clusterQ, clientId);
      nodes = { clientId: clientId, nodes: nodes };

      //get qemu of all nodes
      async function getQemu() {
        for (let i = 0; i < nodes.nodes?.data?.length; i++) {
          //get all qemus
          const qemu = (
            await client.nodes.get(nodes.nodes.data[i].node).qemu.vmlist(0)
          ).response;
          const vmListQ = `/nodes/${nodes.nodes.data[i].node}/qemu/`;
          ResponseRoute.postResponse(qemu, vmListQ, clientId);

          for (let j = 0; j < qemu.data.length; j++) {
            //configure  returned qemus
            let item = (
              await client.nodes
                .get(nodes.nodes.data[i].node)
                .qemu.get(qemu.data[j].vmid)
                .config.vmConfig()
            ).response;

            //add missing attributes status,vmid,node,type
            item = {
              ...item.data,
              status: qemu.data[j]?.status,
              vmid: qemu.data[j]?.vmid,
              node: nodes.nodes.data[i].node,
              type: "qemu",
              pool: cluster.data
                .filter((elem) => elem.vmid == qemu.data[j]?.vmid)
                .map((pool) => pool.pool),
            };
            const configQ = `/nodes/${nodes.nodes.data[i].node}/qemu/${qemu.data[j].vmid}/config`;
            ResponseRoute.postResponse(item, configQ, clientId);
            configuredQemu.push(item);
          }
        }
        return configuredQemu;
      }
      //get lxc of all nodes
      const getLxc = async () => {
        for (let i = 0; i < nodes.nodes?.data?.length; i++) {
          const lxc = (
            await client.nodes.get(nodes.nodes?.data[i].node).lxc.vmlist()
          ).response;
          const vmListQ = `/nodes/${nodes.nodes.data[i].node}/lxc/`;
          ResponseRoute.postResponse(lxc, vmListQ, clientId);

          for (let j = 0; j < lxc.data.length; j++) {
            let item = (
              await client.nodes
                .get(nodes.nodes?.data[i].node)
                .lxc.get(lxc.data[j].vmid)
                .config.vmConfig()
            ).response;
            item = {
              ...item.data,
              status: lxc.data[j]?.status,
              vmid: lxc.data[j]?.vmid,
              node: nodes.nodes.data[i].node,
              type: "lxc",
              pool: cluster.data
                .filter((elem) => elem.vmid == lxc.data[j]?.vmid)
                .map((pool) => pool.pool),
            };
            const configQ = `/nodes/${nodes.nodes.data[i].node}/lxc/${lxc.data[j].vmid}/config`;
            ResponseRoute.postResponse(item, configQ, clientId);
            configuredLxc.push(item);
          }
        }
        return configuredLxc;
      };
      const runner = async () => {
        // await ClusterRoute.postCluster(Cluster);
        const qemu = await getQemu();
        await NodesRoute.postNode(nodes);
        const lxc = await getLxc();
        InstancesRoute.postVms(getNets(getStorage(qemu)));
        InstancesRoute.postVms(getNets(getStorage(lxc)));
        // const pools = await getPools();
        // createJsonFile(getNets(getStorage(qemu)), "vms");
        // createJsonFile(getNets(getStorage(lxc)), "containers");
        // createJsonFile(pools, "pools");
        // createJsonFile(nodes, "nodes");
      };
      runner();
    } else {
      console.log("login", login);
    }
  });
};

Populate(clusters);
