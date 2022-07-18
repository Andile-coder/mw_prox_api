
drop owned by andilemasela;
CREATE TYPE typeInstance AS ENUM ('lxc','qemu');

CREATE TABLE Clusters(
    clusterid      SERIAL PRIMARY KEY,
    name           varchar(100) unique NOT NULL,
    description    varchar(200),
    baseURL        varchar(100)
);


-- CREATE TABLE Nodes(
--     Nodeid SERIAL PRIMARY KEY,
--  ---   clusterId varchar REFERENCES Clusters(name),
--     clusterId varchar REFERENCES Clusters(ClusterId),
--     nodeName VARCHAR(20) NOT NULL,
--     status varchar(20)
--     -- constraint (clusterId,nodeName) is unique;
-- );

create table Nodes (
    Nodeid serial primary key,
    clusterid int REFERENCES clusters(clusterid),
    nodeName VARCHAR(20) NOT NULL,
    status varchar(20)
);

CREATE TABLE instances(
    InstanceId      SERIAL PRIMARY KEY,
    vmid    VARCHAR(20) NOT NULL,
    name    VARCHAR(20) NOT NULL,
    node_id int REFERENCES Nodes(NodeId),
    intanceType typeInstance,
    cores   INT,
    memory  INT,
    status  varchar(20),
    pool varchar (20),
    networks JSON,
    storage JSON
    -- clusterId
-- constraint (clusterId,vmid) is unique;
);

-- INSERT INTO Clusters (name,description,baseURL) VALUES('cluster name','cluster description','cluster url');
-- select clusterId from clusters where name = 'cluster name';
-- INSERT INTO Nodes (clusterId,nodeName,status) VALUES(clusterId,'nodeDemo','status');
-- select nodeId from nodes where nodename='nodedemo';
-- INSERT INTO Instances (vmid,name,nodeId,intanceType,cores,memory,status,networks,storage) VALUES('vmid','instanceName',nodeDemoId,'lxc',23,100,'demostatus','[{"size":"gbo"},{"size":"gb"}]','[{"size":"gbo"},{"size":"gb"}]');


