const getStorage = (instance) => {
  let storageCount = [];
  let storages = [];
  instance.forEach((vm) => {
    let count = 0;
    let tempNets = [];

    for (let [key, value] of Object.entries(vm)) {
      if (value.toString().includes("size=")) {
        count++;
        value = value.toString();
        let net1 = value.split(",").map((elem) => elem.split("="));
        net1[0] = net1[0].join("").split(":");
        let net2 = {};
        net1.forEach((elem) => {
          switch (elem[0]) {
            case "size":
              net2 = { ...net2, size: elem[1] };
              break;
            case "MWhdd":
              net2 = { ...net2, name: "MWhdd" };
              break;
            case "local-zfs":
              net2 = { ...net2, name: "local-zfs" };
              break;
          }
        });

        tempNets.push(net2);
      }
    }

    storageCount.push(count);
    storages.push(tempNets);
  });

  const newInstance = instance.map((vm, index) => {
    return { ...vm, Storage: storages[index] };
  });

  return newInstance;
};
module.exports = getStorage;
