const pool = require("../../config/config.js");
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

const postCluster = async (cluster) => {
  const name = cluster.clusterId;
  const username = cluster.username;
  const pass = cluster.password;
  const auth = cluster.auth;
  const description = cluster.description;
  const baseUrl = cluster.baseUrl;
  const query =
    "INSERT INTO Clusters (name,pass,username,auth,description,baseURL) VALUES($1,$2,$3,$4,$5,$6)";
  pool
    .query(query, [name, pass, username, auth, description, baseUrl])
    .then(() => console.log("cluster added"))
    .catch((error) => console.log(error));
};

module.exports = { postCluster };
