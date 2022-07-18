const pve = require("@corsinvest/cv4pve-api-javascript");
const createJsonFile = require("./createFile");
const getNets = require("./netsDictionary");
const getStorage = require("./storageDictionary");

const Populate = async () => {
  const clientId = "mwprox04.cloudoffice.co.za";
  const username = "noc_audit";

  const client = new pve.PveClient("mwprox04.cloudoffice.co.za", 8006);
  const login = await client.login(
    username,
    "Friday-Uproar6-Wrongdoer-Issuing",
    "pve"
  );
  if (login) {
    console.log("login", login);
    const configuredQemu = [];
    const configuredLxc = [];
    const configuredPools = [];
    //get nodes
    let nodes = (await client.nodes.index()).response;
    let cluster = (await client.cluster.resources.resources("vm")).response;

    nodes = { clientId: clientId, nodes: nodes };
    //get all pools
    const getPools = async () => {
      const pools = (await client.pools.index()).response;

      for (let i = 0; i < pools.data.length; i++) {
        let pool = (await client.pools.get(pools.data[i].poolid).readPool())
          .response;
        pool = { ...pool.data, poolid: pools.data[i].poolid };
        configuredPools.push(pool);
      }

      return configuredPools;
    };

    //get qemu of all nodes
    async function getQemu() {
      for (let i = 0; i < nodes.nodes?.data?.length; i++) {
        //get al qemus
        const qemu = (
          await client.nodes.get(nodes.nodes.data[i].node).qemu.vmlist(0)
        ).response;

        // console.log(qemu);

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
            node: nodes.nodes.data[i].id,
            type: "lxc",
            pool: cluster.data
              .filter((elem) => elem.vmid == lxc.data[j]?.vmid)
              .map((pool) => pool.pool),
          };

          configuredLxc.push(item);
        }
      }
      return configuredLxc;
    };
    const runner = async () => {
      const qemu = await getQemu();
      const lxc = await getLxc();
      const pools = await getPools();
      createJsonFile(getNets(getStorage(qemu)), "vms");
      createJsonFile(getNets(getStorage(lxc)), "containers");
      createJsonFile(pools, "pools");
      createJsonFile(nodes, "nodes");
      createJsonFile(
        {
          clusterId: clientId,
          description: "cluster description",
          baseUrl: `http://${clientId}`,
        },
        "cluster"
      );
    };
    runner();
  } else {
    console.log("login", login);
  }
};

Populate();
