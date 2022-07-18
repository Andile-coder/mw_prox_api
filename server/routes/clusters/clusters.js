const pool = require("../../config/config.js");
const cluster = require("../../../App/data/cluster.json");
const getAllClusters = (req, res) => {
  const query = "SELECT * FROM Clusters";
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

const postCluster = () => {
  const name = cluster.clusterId;
  const description = cluster.description;
  const baseUrl = cluster.baseUrl;
  const query =
    "INSERT INTO Clusters (name,description,baseURL) VALUES($1,$2,$3)";
  pool
    .query(query, [name, description, baseUrl])
    .then(() => console.log("cluster added"))
    .catch((error) => console.log(error));
};

postCluster();

module.exports = { getAllClusters, postCluster };
