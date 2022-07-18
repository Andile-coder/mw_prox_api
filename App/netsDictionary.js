const fs = require("fs");
const getNets = (instance) => {
  let networkCount = [];
  let nets = [];

  instance.forEach((vm) => {
    let count = 0;
    let tempNets = [];
    for (const [key, value] of Object.entries(vm)) {
      if (key.includes("net")) {
        count++;
        let net1 = value.split(",").map((elem) => elem.split("="));
        let net2 = {};
        net1.forEach((elem) => {
          switch (elem[0]) {
            case "virtio":
              net2 = { ...net2, virtio: elem[1] };
              break;
            case "tag":
              net2 = { ...net2, tag: elem[1] };
              break;
            case "bridge":
              net2 = { ...net2, bridge: elem[1] };
              break;
            case "e1000":
              net2 = { ...net2, e1000: elem[1] };
              break;
            case "hwaddr":
              net2 = { ...net2, hwaddr: elem[1] };
              break;
            case "ip":
              net2 = { ...net2, ip: elem[1] };
          }
        });

        tempNets.push(net2);
      }
    }

    networkCount.push(count);
    nets.push(tempNets);
  });

  const newInstance = instance.map((vm, index) => {
    return { ...vm, networks: nets[index] };
  });
  return newInstance;
};

const jsonFilecreator = (data, fileName) => {
  try {
    const stringifyData = JSON.stringify(data);
    fs.writeFile(`${fileName}.json`, stringifyData, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${fileName} has been saved`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = getNets;
