const staticMasterData = {
  projectName: 'test project',
  Organizations: [
    {
      key: '0',
      orgType: 'Orderer',
      orgName: 'Orderer',
      ca: 'orderer-ca',
      msp: 'OrdererMSP',
      peerCount: 3,
      stateDB: 'NA',
      db: 'Not Require',
    },
    { key: '1', orgType: 'Peer', orgName: 'Org1', ca: 'org1-ca', msp: 'Org1MSP', peerCount: '1', peerPorts: [7051], db: 'Couchdb' },
    { key: '2', orgType: 'Peer', orgName: 'Org2', ca: 'org2-ca', msp: 'Org2MSP', peerCount: '1', peerPorts: [8051], db: 'Couchdb' },
    { key: '3', orgType: 'Peer', orgName: 'Org3', ca: 'org3-ca', msp: 'Org3MSP', peerCount: '1', peerPorts: [9051], db: 'Couchdb' },
    { key: '4', orgType: 'Peer', orgName: 'Org4', ca: 'org4-ca', msp: 'Org4MSP', peerCount: '2', peerPorts: [10051, 11051], db: 'Couchdb' },
  ],
  channels: [
    {
      key: '0',
      channelName: 'mychannel1',
      orgName: ['Org1', 'Org2', 'Org3', 'Org4'],
      ChaincodeName: 'chaincode1',
      endorsement: 'Org1',
      dataType: 'Channel',
    },
    {
      key: '1',
      channelName: 'mychannel2',
      orgName: ['Org1', 'Org2'],
      ChaincodeName: 'chaincode2',
      endorsement: 'Org1',
      dataType: 'Channel',
    },
    {
      key: '2',
      channelName: 'mychannel3',
      orgName: ['Org1', 'Org2', 'Org3', 'Org4'],
      ChaincodeName: 'chaincode3',
      endorsement: 'Org1',
      dataType: 'Channel',
    },
    {
      key: '3',
      channelName: 'mychannel4',
      orgName: ['Org1', 'Org4'],
      ChaincodeName: 'chaincode4',
      endorsement: 'Org1',
      dataType: 'Channel',
    },
  ],
};

const CADockerComposeFile = () => {
  let data = {
    version: '2.1',
    networks: {
      test: null,
    },
    services: {
      ca_org1: {
        image: 'hyperledger/fabric-ca',
        environment: [
          'FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server',
          'FABRIC_CA_SERVER_CA_NAME=ca.org1.example.com',
          'FABRIC_CA_SERVER_TLS_ENABLED=true',
          'FABRIC_CA_SERVER_PORT=7054',
        ],
        ports: ['7054:7054'],
        command: "sh -c 'fabric-ca-server start -b admin:adminpw -d'",
        volumes: ['./fabric-ca/org1:/etc/hyperledger/fabric-ca-server'],
        container_name: 'ca.org1.example.com',
        hostname: 'ca.org1.example.com',
        networks: ['test'],
      },
      ca_org2: {
        image: 'hyperledger/fabric-ca',
        environment: [
          'FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server',
          'FABRIC_CA_SERVER_CA_NAME=ca.org2.example.com',
          'FABRIC_CA_SERVER_TLS_ENABLED=true',
          'FABRIC_CA_SERVER_PORT=8054',
        ],
        ports: ['8054:8054'],
        command: "sh -c 'fabric-ca-server start -b admin:adminpw -d'",
        volumes: ['./fabric-ca/org2:/etc/hyperledger/fabric-ca-server'],
        container_name: 'ca.org2.example.com',
        hostname: 'ca.org2.example.com',
        networks: ['test'],
      },
      ca_org3: {
        image: 'hyperledger/fabric-ca',
        environment: [
          'FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server',
          'FABRIC_CA_SERVER_CA_NAME=ca.org3.example.com',
          'FABRIC_CA_SERVER_TLS_ENABLED=true',
          'FABRIC_CA_SERVER_PORT=10054',
        ],
        ports: ['10054:10054'],
        command: "sh -c 'fabric-ca-server start -b admin:adminpw -d'",
        volumes: ['./fabric-ca/org3:/etc/hyperledger/fabric-ca-server'],
        container_name: 'ca.org3.example.com',
        hostname: 'ca.org3.example.com',
        networks: ['test'],
      },
      ca_orderer: {
        image: 'hyperledger/fabric-ca',
        environment: [
          'FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server',
          'FABRIC_CA_SERVER_CA_NAME=ca-orderer',
          'FABRIC_CA_SERVER_TLS_ENABLED=true',
          'FABRIC_CA_SERVER_PORT=9054',
        ],
        ports: ['9054:9054'],
        command: "sh -c 'fabric-ca-server start -b admin:adminpw -d'",
        volumes: ['./fabric-ca/ordererOrg:/etc/hyperledger/fabric-ca-server'],
        container_name: 'ca_orderer',
        networks: ['test'],
      },
    },
  };
};

const CAScriptFile = () => {
  let data = {};
};

const configFileJSONData = () => {
  const d = {
    Organizations: [
      {
        Name: 'OrdererOrg',
        ID: 'OrdererMSP',
        MSPDir: 'crypto-config/ordererOrganizations/example.com/msp',
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: "OR('OrdererMSP.member')",
          },
          Writers: {
            Type: 'Signature',
            Rule: "OR('OrdererMSP.member')",
          },
          Admins: {
            Type: 'Signature',
            Rule: "OR('OrdererMSP.admin')",
          },
        },
      },
      {
        Name: 'Org1MSP',
        ID: 'Org1MSP',
        MSPDir: 'crypto-config/peerOrganizations/org1.example.com/msp',
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')",
          },
          Writers: {
            Type: 'Signature',
            Rule: "OR('Org1MSP.admin', 'Org1MSP.client')",
          },
          Admins: {
            Type: 'Signature',
            Rule: "OR('Org1MSP.admin')",
          },
          Endorsement: {
            Type: 'Signature',
            Rule: "OR('Org1MSP.peer')",
          },
        },
        AnchorPeers: [
          {
            Host: 'peer0.org1.example.com',
            Port: 7051,
          },
        ],
      },
      {
        Name: 'Org2MSP',
        ID: 'Org2MSP',
        MSPDir: 'crypto-config/peerOrganizations/org2.example.com/msp',
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')",
          },
          Writers: {
            Type: 'Signature',
            Rule: "OR('Org2MSP.admin', 'Org2MSP.client')",
          },
          Admins: {
            Type: 'Signature',
            Rule: "OR('Org2MSP.admin')",
          },
          Endorsement: {
            Type: 'Signature',
            Rule: "OR('Org2MSP.peer')",
          },
        },
        AnchorPeers: [
          {
            Host: 'peer0.org2.example.com',
            Port: 9051,
          },
        ],
      },
      {
        Name: 'Org3MSP',
        ID: 'Org3MSP',
        MSPDir: 'crypto-config/peerOrganizations/org3.example.com/msp',
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: "OR('Org3MSP.admin', 'Org3MSP.peer', 'Org3MSP.client')",
          },
          Writers: {
            Type: 'Signature',
            Rule: "OR('Org3MSP.admin', 'Org3MSP.client')",
          },
          Admins: {
            Type: 'Signature',
            Rule: "OR('Org3MSP.admin')",
          },
          Endorsement: {
            Type: 'Signature',
            Rule: "OR('Org3MSP.peer')",
          },
        },
        AnchorPeers: [
          {
            Host: 'peer0.org3.example.com',
            Port: 11051,
          },
        ],
      },
    ],
    Capabilities: {
      Channel: {
        V2_0: true,
      },
      Orderer: {
        V2_0: true,
      },
      Application: {
        V2_5: true,
      },
    },
    Application: {
      ACLs: {
        '_lifecycle/CommitChaincodeDefinition': '/Channel/Application/Writers',
        '_lifecycle/QueryChaincodeDefinition': '/Channel/Application/Readers',
        '_lifecycle/QueryNamespaceDefinitions': '/Channel/Application/Readers',
        'lscc/ChaincodeExists': '/Channel/Application/Readers',
        'lscc/GetDeploymentSpec': '/Channel/Application/Readers',
        'lscc/GetChaincodeData': '/Channel/Application/Readers',
        'lscc/GetInstantiatedChaincodes': '/Channel/Application/Readers',
        'qscc/GetChainInfo': '/Channel/Application/Readers',
        'qscc/GetBlockByNumber': '/Channel/Application/Readers',
        'qscc/GetBlockByHash': '/Channel/Application/Readers',
        'qscc/GetTransactionByID': '/Channel/Application/Readers',
        'qscc/GetBlockByTxID': '/Channel/Application/Readers',
        'cscc/GetConfigBlock': '/Channel/Application/Readers',
        'cscc/GetConfigTree': '/Channel/Application/Readers',
        'cscc/SimulateConfigTreeUpdate': '/Channel/Application/Readers',
        'peer/Propose': '/Channel/Application/Writers',
        'peer/ChaincodeToChaincode': '/Channel/Application/Readers',
        'event/Block': '/Channel/Application/Readers',
        'event/FilteredBlock': '/Channel/Application/Readers',
      },
      Organizations: null,
      Policies: {
        Readers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Readers',
        },
        Writers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Writers',
        },
        Admins: {
          Type: 'ImplicitMeta',
          Rule: 'MAJORITY Admins',
        },
        LifecycleEndorsement: {
          Type: 'ImplicitMeta',
          Rule: 'MAJORITY Endorsement',
        },
        Endorsement: {
          Type: 'ImplicitMeta',
          Rule: 'MAJORITY Endorsement',
        },
      },
      Capabilities: {
        V2_5: true,
      },
    },
    Orderer: {
      OrdererType: 'etcdraft',
      EtcdRaft: {
        Consenters: [
          {
            Host: 'orderer.example.com',
            Port: 7050,
            ClientTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt',
            ServerTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt',
          },
        ],
      },
      Addresses: ['orderer.example.com:7050'],
      BatchTimeout: '2s',
      BatchSize: {
        MaxMessageCount: 10,
        AbsoluteMaxBytes: '99 MB',
        PreferredMaxBytes: '512 KB',
      },
      Organizations: null,
      Policies: {
        Readers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Readers',
        },
        Writers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Writers',
        },
        Admins: {
          Type: 'ImplicitMeta',
          Rule: 'MAJORITY Admins',
        },
        BlockValidation: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Writers',
        },
      },
    },
    Channel: {
      Policies: {
        Readers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Readers',
        },
        Writers: {
          Type: 'ImplicitMeta',
          Rule: 'ANY Writers',
        },
        Admins: {
          Type: 'ImplicitMeta',
          Rule: 'MAJORITY Admins',
        },
      },
      Capabilities: {
        V2_0: true,
      },
    },
    Profiles: {
      ThreeOrgsApplicationGenesis: {
        Policies: {
          Readers: {
            Type: 'ImplicitMeta',
            Rule: 'ANY Readers',
          },
          Writers: {
            Type: 'ImplicitMeta',
            Rule: 'ANY Writers',
          },
          Admins: {
            Type: 'ImplicitMeta',
            Rule: 'MAJORITY Admins',
          },
        },
        Capabilities: {
          V2_0: true,
        },
        Orderer: {
          OrdererType: 'etcdraft',
          EtcdRaft: {
            Consenters: [
              {
                Host: 'orderer.example.com',
                Port: 7050,
                ClientTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt',
                ServerTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt',
              },
              {
                Host: 'orderer2.example.com',
                Port: 7050,
                ClientTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt',
                ServerTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt',
              },
              {
                Host: 'orderer3.example.com',
                Port: 7050,
                ClientTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt',
                ServerTLSCert: 'crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt',
              },
            ],
          },
          Addresses: ['orderer.example.com:7050', 'orderer2.example.com:7050', 'orderer3.example.com:7050'],
          BatchTimeout: '2s',
          BatchSize: {
            MaxMessageCount: 10,
            AbsoluteMaxBytes: '99 MB',
            PreferredMaxBytes: '512 KB',
          },
          Organizations: [
            {
              Name: 'OrdererOrg',
              ID: 'OrdererMSP',
              MSPDir: 'crypto-config/ordererOrganizations/example.com/msp',
              Policies: {
                Readers: {
                  Type: 'Signature',
                  Rule: "OR('OrdererMSP.member')",
                },
                Writers: {
                  Type: 'Signature',
                  Rule: "OR('OrdererMSP.member')",
                },
                Admins: {
                  Type: 'Signature',
                  Rule: "OR('OrdererMSP.admin')",
                },
              },
            },
          ],
          Policies: {
            Readers: {
              Type: 'ImplicitMeta',
              Rule: 'ANY Readers',
            },
            Writers: {
              Type: 'ImplicitMeta',
              Rule: 'ANY Writers',
            },
            Admins: {
              Type: 'ImplicitMeta',
              Rule: 'MAJORITY Admins',
            },
            BlockValidation: {
              Type: 'ImplicitMeta',
              Rule: 'ANY Writers',
            },
          },
          Capabilities: {
            V2_0: true,
          },
        },
        Application: {
          ACLs: {
            '_lifecycle/CommitChaincodeDefinition': '/Channel/Application/Writers',
            '_lifecycle/QueryChaincodeDefinition': '/Channel/Application/Readers',
            '_lifecycle/QueryNamespaceDefinitions': '/Channel/Application/Readers',
            'lscc/ChaincodeExists': '/Channel/Application/Readers',
            'lscc/GetDeploymentSpec': '/Channel/Application/Readers',
            'lscc/GetChaincodeData': '/Channel/Application/Readers',
            'lscc/GetInstantiatedChaincodes': '/Channel/Application/Readers',
            'qscc/GetChainInfo': '/Channel/Application/Readers',
            'qscc/GetBlockByNumber': '/Channel/Application/Readers',
            'qscc/GetBlockByHash': '/Channel/Application/Readers',
            'qscc/GetTransactionByID': '/Channel/Application/Readers',
            'qscc/GetBlockByTxID': '/Channel/Application/Readers',
            'cscc/GetConfigBlock': '/Channel/Application/Readers',
            'cscc/GetConfigTree': '/Channel/Application/Readers',
            'cscc/SimulateConfigTreeUpdate': '/Channel/Application/Readers',
            'peer/Propose': '/Channel/Application/Writers',
            'peer/ChaincodeToChaincode': '/Channel/Application/Readers',
            'event/Block': '/Channel/Application/Readers',
            'event/FilteredBlock': '/Channel/Application/Readers',
          },
          Organizations: [
            {
              Name: 'Org1MSP',
              ID: 'Org1MSP',
              MSPDir: 'crypto-config/peerOrganizations/org1.example.com/msp',
              Policies: {
                Readers: {
                  Type: 'Signature',
                  Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')",
                },
                Writers: {
                  Type: 'Signature',
                  Rule: "OR('Org1MSP.admin', 'Org1MSP.client')",
                },
                Admins: {
                  Type: 'Signature',
                  Rule: "OR('Org1MSP.admin')",
                },
                Endorsement: {
                  Type: 'Signature',
                  Rule: "OR('Org1MSP.peer')",
                },
              },
              AnchorPeers: [
                {
                  Host: 'peer0.org1.example.com',
                  Port: 7051,
                },
              ],
            },
            {
              Name: 'Org2MSP',
              ID: 'Org2MSP',
              MSPDir: 'crypto-config/peerOrganizations/org2.example.com/msp',
              Policies: {
                Readers: {
                  Type: 'Signature',
                  Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')",
                },
                Writers: {
                  Type: 'Signature',
                  Rule: "OR('Org2MSP.admin', 'Org2MSP.client')",
                },
                Admins: {
                  Type: 'Signature',
                  Rule: "OR('Org2MSP.admin')",
                },
                Endorsement: {
                  Type: 'Signature',
                  Rule: "OR('Org2MSP.peer')",
                },
              },
              AnchorPeers: [
                {
                  Host: 'peer0.org2.example.com',
                  Port: 9051,
                },
              ],
            },
            {
              Name: 'Org3MSP',
              ID: 'Org3MSP',
              MSPDir: 'crypto-config/peerOrganizations/org3.example.com/msp',
              Policies: {
                Readers: {
                  Type: 'Signature',
                  Rule: "OR('Org3MSP.admin', 'Org3MSP.peer', 'Org3MSP.client')",
                },
                Writers: {
                  Type: 'Signature',
                  Rule: "OR('Org3MSP.admin', 'Org3MSP.client')",
                },
                Admins: {
                  Type: 'Signature',
                  Rule: "OR('Org3MSP.admin')",
                },
                Endorsement: {
                  Type: 'Signature',
                  Rule: "OR('Org3MSP.peer')",
                },
              },
              AnchorPeers: [
                {
                  Host: 'peer0.org3.example.com',
                  Port: 11051,
                },
              ],
            },
          ],
          Policies: {
            Readers: {
              Type: 'ImplicitMeta',
              Rule: 'ANY Readers',
            },
            Writers: {
              Type: 'ImplicitMeta',
              Rule: 'ANY Writers',
            },
            Admins: {
              Type: 'ImplicitMeta',
              Rule: 'MAJORITY Admins',
            },
            LifecycleEndorsement: {
              Type: 'ImplicitMeta',
              Rule: 'MAJORITY Endorsement',
            },
            Endorsement: {
              Type: 'ImplicitMeta',
              Rule: 'MAJORITY Endorsement',
            },
          },
          Capabilities: {
            V2_5: true,
          },
        },
      },
    },
  };
};

let d = {
  projectName: 'test22',
  Organizations: [
    {
      key: '0',
      orgType: 'Orderer',
      orgName: 'Orderer',
      ca: 'orderer-ca',
      msp: 'OrdererMSP',
      peerCount: 3,
      stateDB: 'NA',
      db: 'Not Require',
    },
    { key: '1', orgType: 'Peer', orgName: 'Org1', ca: 'org1-ca', msp: 'Org1MSP', peerCount: '1', db: 'Couchdb' },
    { key: '2', orgType: 'Peer', orgName: 'Org2', ca: 'org2-ca', msp: 'Org2MSP', peerCount: '1', db: 'Couchdb' },
    { key: '3', orgType: 'Peer', orgName: 'Org3', ca: 'org3-ca', msp: 'Org3MSP', peerCount: '1', db: 'Couchdb' },
    { key: '4', orgType: 'Peer', orgName: 'Org4', ca: 'org4-ca', msp: 'Org4MSP', peerCount: '1', db: 'Couchdb' },
    { key: '5', orgType: 'Peer', orgName: 'Org5', ca: 'org5-ca', msp: 'Org5MSP', peerCount: '1', db: 'Couchdb' },
  ],
  channels: [
    {
      key: '0',
      channelName: 'mychannel1',
      orgName: ['Org1', 'Org3', 'Org5'],
      ChaincodeName: 'chaincode1',
      endorsement: 'Org1',
      dataType: 'Channel',
    },
    {
      key: '1',
      channelName: 'mychannel2',
      orgName: ['Org1', 'Org2', 'Org3', 'Org4', 'Org5'],
      ChaincodeName: 'chaincode2',
      endorsement: 'Org1',
      dataType: 'Channel',
    }]
  }





module.exports = {
  staticMasterData,
}
