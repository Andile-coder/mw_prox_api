DROP TABLE vms;
DROP TABLE lxc;

create table Cluster (
    clusterid integer unique primary key,
    clustername varchar,
    description varchar,
    baseURL varchar
)

create table nodes {
    nodeid int uniq primary,
    nodename varchar,
    nameURL varchar,
    memberOf integer foreign key Cluster.clusterid
    nodeDescription varchar
}

CREATE TABLE Instances(
    NodeOn foreign key nodes.nodeid,
    vmid        VARCHAR(30) NOT NULL ,
    typeInstance enum{LXC, qm},
    name        VARCHAR(120) NOT NULL,
    networks    VARCHAR[],
    storage     VARCHAR[]
);
primary (NodeOn,vmid)

create view (temp) AllCluster {
 select Instances.*,Nodes.nodename,clusters.clustername from Insantces 
    join Nodes.nodein=Instances.NodeOn
     join Clusters.clusterid = nodes.MemberOf
}

select * from AllClusters where Clusterid="testproxID";
select * from AllClusters where REsourcePool="ClientID";

-- CREATE TABLE lxc(
--     vmid        VARCHAR(30) NOT NULL UNIQUE,
--     name        VARCHAR(120) NOT NULL,
--     networks    JSON,
--     storage     JSON
-- );

INSERT INTO vms (vmid,name,networks) VALUES (123,'john','{hell,world,yes}');