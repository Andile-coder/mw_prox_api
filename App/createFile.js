const fs = require("fs");
const createJsonFile = (data, fileName) => {
  try {
    const stringifyData = JSON.stringify(data);
    fs.writeFile(`./data/${fileName}.json`, stringifyData, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${fileName}.json has been saved`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = createJsonFile;
