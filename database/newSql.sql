
drop owned by andilemasela;
CREATE TYPE typeInstance AS ENUM ('lxc','qemu');

CREATE TABLE Clusters(
    clusterid      SERIAL PRIMARY KEY,
    name           varchar(100) unique NOT NULL,
    pass           varchar,
    username       varchar,
    auth           varchar,
    description    varchar(200),
    baseURL        varchar(100)
);
create table Nodes (
    Nodeid serial primary key,
    clusterid int REFERENCES clusters(clusterid),
    nodeName VARCHAR(100) NOT NULL,
    status varchar(100),
    unique (Nodeid,clusterid)
);

CREATE TABLE instances(
    InstanceId      SERIAL PRIMARY KEY,
    vmid    VARCHAR(100) NOT NULL,
    name    VARCHAR(100) ,
    node_id int REFERENCES Nodes(NodeId),
    intanceType typeInstance,
    cores   INT,
    memory  INT,
    status  varchar(100),
    pool varchar (100),
    networks JSON,
    storage JSON,
    clusterId int REFERENCES clusters(clusterid),
    unique(clusterid,vmid)
);
create table responses(
    responseId serial primary key,
    loadTime timestamptz,
    clusterId int ,
    query varchar,
    response JSON
);


