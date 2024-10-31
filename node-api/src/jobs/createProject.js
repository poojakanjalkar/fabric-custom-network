const fs = require('fs');
// const { staticMasterData } = require('../data/conf');
const yaml = require('js-yaml');
const path = require('path');


const projectName = 'NetworksData';

let firstCAPort = 7054;
let firstPeerPort = 7050;


const createUserProject = async (user, folderName) => {
  //

  // const data = staticMasterData;
  // console.log(data);
  const userFolder = `${__dirname}/${projectName}/${user}/${folderName}`;
  console.log("-------", userFolder)
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }
};

const createFileIfNotExist = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
};

const getFinalFolder = (projectName, email, networkName) => {
  return `${__dirname}/${projectName}/${email}/${networkName}`;
}

// docker-compose file for CA

const createCADockerComposeFile = async (staticMasterData, userFolder) => {

  // const userFolder =  getFinalFolder()



  let finalData = {
    version: '2.1',
    networks: {
      test: null,
    },
    services: {},
  };

  let filePath = `${userFolder}/blockchain/artifacts/channel/create-certificate-with-ca/`;
  createFileIfNotExist(filePath);
  let caPort = firstCAPort;

  for (let org of staticMasterData.Organizations) {
    let serviceData = {
      image: 'hyperledger/fabric-ca',
      environment: [
        'FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server',
        `FABRIC_CA_SERVER_CA_NAME=ca.${org.orgName}.com`,
        'FABRIC_CA_SERVER_TLS_ENABLED=true',
        `FABRIC_CA_SERVER_PORT=${caPort}`,
      ],
      ports: [`${caPort}:${caPort}`],
      command: "sh -c 'fabric-ca-server start -b admin:adminpw -d'",
      volumes: [`./fabric-ca/${org.orgName}:/etc/hyperledger/fabric-ca-server`],
      container_name: `ca.${org.orgName}.com`,
      hostname: `ca.${org.orgName}.com`,
      networks: ['test'],
    };

    finalData.services[`ca_${org.orgName}`] = serviceData;
    // finalData.services[`ca_${org.orgName}`]+= "\n"

    caPort += 1000;
  }

  const yamlData = yaml.dump(finalData);
  fs.writeFileSync(`${filePath}docker-compose.yaml`, yamlData, 'utf8');
  fs.writeFileSync(`${filePath}.env`, 'COMPOSE_PROJECT_NAME=artifacts', 'utf8');
};

//1
// createCADockerComposeFile(staticMasterData);

// 2
const createCryptoConfigScript = async (staticMasterData, userFolder) => {
  let filePath = `${userFolder}/blockchain/artifacts/channel/create-certificate-with-ca/`;

  let finalContent = `#!/bin/bash
echo "Hello, this is a shell script created with Node.js!"
`;

  let callingFunctions = ''

  let caPort = firstCAPort;

  let firstPeerOrg = staticMasterData?.Organizations?.find(e => e.orgType == 'Peer')

  for (let org of staticMasterData?.Organizations) {
    if (org.orgType === 'Peer') {
      callingFunctions += `CreateCertificatesFor${org.orgName}` + '\n'
      let orgRegistrationContent = `
    CreateCertificatesFor${org.orgName}() {
  
    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/
    export FABRIC_CA_CLIENT_HOME=\${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/
  
  
     
    fabric-ca-client enroll -u https://admin:adminpw@localhost:${caPort} --caname ca.${org.orgName}.com --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
     
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: orderer' >\${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/msp/config.yaml
  
    echo
    echo "Register user"
    echo
    fabric-ca-client register --caname ca.${org.orgName}.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.${org.orgName}.com --id.name ${org.orgName}admin --id.secret ${org.orgName}adminpw --id.type admin --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/peers
  
  
  
  
    `;
      let peersContent = '';

      for (let i = 1; i <= parseInt(org.peerCount); i++) {
        let c2 = '';

        c2 = `
      echo
      echo "Register peer${i}"
      echo
      fabric-ca-client register --caname ca.${org.orgName}.com --id.name peer${i} --id.secret peer${i}pw --id.type peer --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
    
      
      echo
      echo "## Generate the peer${i} msp"
      echo
      fabric-ca-client enroll -u https://peer${i}:peer${i}pw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/msp --csr.hosts peer${i}.${org.orgName}.com --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem

      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/msp/config.yaml \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/msp/config.yaml


      
      echo
      echo "## Generate the peer${i}-tls certificates"
      echo
      fabric-ca-client enroll -u https://peer${i}:peer${i}pw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls --enrollment.profile tls --csr.hosts peer${i}.${org.orgName}.com --csr.hosts localhost --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/tlscacerts/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/ca.crt
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/signcerts/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/server.crt
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/keystore/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/server.key
  
      mkdir \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/msp/tlscacerts
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/tlscacerts/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/msp/tlscacerts/ca.crt
  
      mkdir \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/tlsca
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/tls/tlscacerts/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/tlsca/tlsca.${org.orgName}.com-cert.pem
  
      mkdir \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/ca
      cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com/msp/cacerts/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/ca/ca.${org.orgName}.com-cert.pem
  
      # --------------------------------------------------------------------------------------------------
  
      mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/users
      mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/users/User1@${org.orgName}.com
  
      `;
        peersContent = peersContent + '\n' + c2 + '\n';
      }

      let userMSP = `
  
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/users
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/users/User1@${org.orgName}.com
  
    echo
    echo "## Generate the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/User1@${org.orgName}.com/msp --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
    cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/User1@${org.orgName}.com/msp/keystore/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/User1@${org.orgName}.com/msp/keystore/priv_sk
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com
  
    echo
    echo "## Generate the org admin msp"
    echo
    fabric-ca-client enroll -u https://${org.orgName}admin:${org.orgName}adminpw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
    cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp/keystore/* \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp/keystore/priv_sk
    cp \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/msp/config.yaml \${PWD}/../crypto-config/peerOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp/config.yaml
  
    `;

      finalContent = finalContent + '\n' + orgRegistrationContent + '\n' + peersContent + '\n' + userMSP + '\n' + '}';

      caPort += 1000;
    } else {
      callingFunctions += `CreateCertificatesFor${org.orgName}` + '\n'
      let orgRegistrationContent = `
    CreateCertificatesFor${org.orgName}() {

    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}.com/
    export FABRIC_CA_CLIENT_HOME=\${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/

    fabric-ca-client enroll -u https://admin:adminpw@localhost:${caPort} --caname ca.${org.orgName}.com --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-${caPort}-ca-${org.orgName}-com.pem
      OrganizationalUnitIdentifier: orderer' >\${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/config.yaml
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.${org.orgName}.com --id.name ${org.orgName}admin --id.secret ${org.orgName}adminpw --id.type admin --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
    mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}.com/orderers
  
  
    `;

      let orderersContent = '';
      for (let i = 1; i <= parseInt(org.peerCount); i++) {
        let c2 = '';
        c2 = `
      echo
      echo "Register orderer${i}"
      echo
       
      fabric-ca-client register --caname ca.${org.orgName}.com --id.name orderer${i} --id.secret orderer${i}pw --id.type orderer --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
       
      # ---------------------------------------------------------------------------
      #  ${org.orgName}

      mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com

      echo
      echo "## Generate the  orderer${i} msp"
      echo
      
      fabric-ca-client enroll -u https://orderer${i}:orderer${i}pw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/msp --csr.hosts orderer${i}.com --csr.hosts localhost --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/config.yaml \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/msp/config.yaml

      echo
      echo "## Generate the orderer${i}-tls certificates"
      echo
      
      fabric-ca-client enroll -u https://orderer${i}:orderer${i}pw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls --enrollment.profile tls --csr.hosts orderer${i}.com --csr.hosts localhost --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/ca.crt
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/signcerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/server.crt
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/keystore/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/server.key

      mkdir \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/msp/tlscacerts
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/msp/tlscacerts/tlsca.${org.orgName}.com-cert.pem

      mkdir \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/tlscacerts
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/tlscacerts/tlsca.${org.orgName}.com-cert.pem

      `;

        orderersContent = orderersContent + '\n' + c2 + '\n';
      }

      let userMSP = '';
      userMSP = `

      mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}.com/users
      mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com

      echo
      echo "## Generate the admin msp"
      echo
      
      fabric-ca-client enroll -u https://${org.orgName}admin:${org.orgName}adminpw@localhost:${caPort} --caname ca.${org.orgName}.com -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/config.yaml \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp/config.yaml

        `;

      finalContent = finalContent + '\n' + orgRegistrationContent + orderersContent + userMSP + '\n' + '}';

      caPort += 1000;
    }
  }

  connectionScript = ` \n


  createConnectionProfile() {
    cd ../../../../api/connection-profiles && ./generate-ccp.sh

    cp connection-${firstPeerOrg.orgName}.json ../../blockchain/artifacts/channel/crypto-config/peerOrganizations/${firstPeerOrg.orgName}.com/
  } 
  
  `
  finalContent += `\n` + connectionScript

  callingFunctions += `\n` + 'createConnectionProfile'

  finalContent += `\n` + callingFunctions

  // const yamlData = yaml.dump(finalData);
  fs.writeFileSync(`${filePath}create-certificate-with-ca.sh`, finalContent, 'utf8');
};

//2
// createCryptoConfigScript(staticMasterData);

// 3
const createConfigTxFile = async (staticMasterData, userFolder) => {
  let finalObject = {};

  let orgs = [];
  let o;
  let peerPort = firstPeerPort;

  for (let org of staticMasterData.Organizations) {
    if (org.orgType === 'Peer') {
      o = {
        Name: `${org.orgName}`,
        ID: `${org.orgName}MSP`,
        MSPDir: `crypto-config/peerOrganizations/${org.orgName}.com/msp`,
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.admin', '${org.orgName}MSP.peer', '${org.orgName}MSP.client')`,
          },
          Writers: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.admin', '${org.orgName}MSP.client')`,
          },
          Admins: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.admin')`,
          },
          Endorsement: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.peer')`,
          },
        },
        AnchorPeers: [
          {
            Host: `peer1.${org.orgName}.com`,
            Port: `${org.peerPorts[0]}`,
          },
        ],
      };
      orgs.push(o);
      peerPort += 1000;
    } else {
      o = {
        Name: `${org.orgName}`,
        ID: `${org.orgName}MSP`,
        MSPDir: `crypto-config/ordererOrganizations/${org.orgName}.com/msp`,
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.member')`,
          },
          Writers: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.member')`,
          },
          Admins: {
            Type: 'Signature',
            Rule: `OR('${org.orgName}MSP.admin')`,
          },
        },
      };

      orgs.push(o);
    }
  }

  finalObject.Organizations = orgs;

  // console.log("------------finalObject.Organizations----------------", finalObject.Organizations)

  finalObject.Capabilities = {
    Channel: {
      V2_0: true,
    },
    Orderer: {
      V2_0: true,
    },
    Application: {
      V2_5: true,
    },
  };

  finalObject.Application = {
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
  };

  let consenters = [];
  let addresses = [];

  let ordererOrg = staticMasterData.Organizations.find((e) => e.orgType !== 'Peer');

  let ordererCount = ordererOrg?.peerCount;
  let consenter;
  let address;
  // let port = firstOrdererPort;
  for (let i = 1; i <= ordererCount; i++) {
    consenter = {
      Host: `orderer${i}.com`,
      Port: 7050,
      ClientTLSCert: `crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/orderers/orderer${i}.com/tls/server.crt`,
      ServerTLSCert: `crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/orderers/orderer${i}.com/tls/server.crt`,
    };

    address = `orderer${i}.com:7050`;

    consenters.push(consenter);
    addresses.push(address);

    // port += 1000;
  }

  finalObject.Orderer = {
    OrdererType: 'etcdraft',
    EtcdRaft: {
      Consenters: consenters,
    },
    Addresses: addresses,
    BatchTimeout: '2s',
    BatchSize: {
      MaxMessageCount: 10,
      AbsoluteMaxBytes: '99 MB',
      PreferredMaxBytes: '512 KB',
    },
    Organizations: [
      {
        Name: `${ordererOrg.orgName}`,
        ID: `${ordererOrg.orgName}MSP`,
        MSPDir: `crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/msp`,
        Policies: {
          Readers: {
            Type: 'Signature',
            Rule: `OR('${ordererOrg.orgName}MSP.member')`,
          },
          Writers: {
            Type: 'Signature',
            Rule: `OR('${ordererOrg.orgName}MSP.member')`,
          },
          Admins: {
            Type: 'Signature',
            Rule: `OR('${ordererOrg.orgName}MSP.admin')`,
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
  };

  finalObject.Channel = {
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
  };

  finalObject.Profiles = {};

  // let channelOrgs;
  for (let channel of staticMasterData.channels) {
    let channelsOrgs = finalObject.Organizations.filter((item1) => channel?.orgName?.some((item2) => item1.Name === item2));

    // console.log('----------channelsOrgs--------', channelsOrgs, finalObject.Organizations);

    finalObject.Profiles[`${channel.channelName}`] = {
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
      Orderer: finalObject.Orderer,
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
        Organizations: channelsOrgs,
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
    };
  }

  let filePath = `${userFolder}/blockchain/artifacts/channel/`;

  const yamlData = yaml.dump(finalObject);
  fs.writeFileSync(`${filePath}configtx.yaml`, yamlData, 'utf8');
};
// createConfigTxFile(staticMasterData)

// createProject()

const createArtifacts = async (staticMasterData, userFolder) => {
  let filePath = `${userFolder}/blockchain/artifacts/channel/`;
  createFileIfNotExist(filePath);
  let finalContent = `#!/bin/bash
  echo "Hello, this is a shell script created with Node.js!"
  `;

  for (let channel of staticMasterData?.channels) {
    let channelContent = `
    echo Creating artifacts for  ${channel.channelName}
    CHANNEL_NAME=${channel.channelName}
    configtxgen -profile ${channel.channelName} -configPath . -channelID $CHANNEL_NAME  -outputBlock ../../channel-artifacts/$CHANNEL_NAME.block

    `;
    finalContent = finalContent + '\n' + channelContent;
  }

  fs.writeFileSync(`${filePath}/create-artifacts.sh`, finalContent, 'utf8');
};

// createArtifacts(staticMasterData)

const createServicesDockerComposeFile = async (staticMasterData, userFolder) => {
  let finalData = {
    // version: '2.1',
    networks: {
      test: null,
    },
    services: {},
  };

  let filePath = `${userFolder}/blockchain/artifacts/`;
  createFileIfNotExist(filePath);

  let couchDBStart = 1;
  let couchDBExposedPortStart = 5984;

  for (let org of staticMasterData.Organizations) {
    if (org.orgType === 'Peer') {
      for (let i = 1; i <= parseInt(org.peerCount); i++) {
        let peerServiceKey = `peer${i}.${org.orgName}.com`;
        let peerService = {
          container_name: `peer${i}.${org.orgName}.com`,
          image: 'hyperledger/fabric-peer:2.5.5',
          labels: {
            service: 'hyperledger-fabric',
          },
          environment: [
            'CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock',
            'FABRIC_LOGGING_SPEC=info',
            'ORDERER_GENERAL_LOGLEVEL=info',
            `CORE_PEER_LOCALMSPID=${org.orgName}MSP`,
            'CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=artifacts_test',
            `CORE_PEER_ID=peer${i}.${org.orgName}.com`,
            `CORE_PEER_ADDRESS=peer${i}.${org.orgName}.com:${org.peerPorts[i - 1]}`,
            `CORE_PEER_LISTENADDRESS=0.0.0.0:${org.peerPorts[i - 1]}`,
            `CORE_PEER_CHAINCODEADDRESS=peer${i}.${org.orgName}.com:${org.peerPorts[i - 1] + i}`,
            `CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:${org.peerPorts[i - 1] + i}`,
            `CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer${i}.${org.orgName}.com:${org.peerPorts[i - 1]}`,
            'CORE_LEDGER_STATE_STATEDATABASE=CouchDB',
            `CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb${couchDBStart}:5984`,
            'CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin',
            'CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw',
            'CORE_PEER_TLS_ENABLED=true',
            'CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt',
            'CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key',
            'CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt',
            'CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp',
          ],
          ports: [`${org.peerPorts[i - 1]}:${org.peerPorts[i - 1]}`],
          volumes: [
            `./channel/crypto-config/peerOrganizations/${org.orgName}.com/peers/peer${i}.${org.orgName}.com:/etc/hyperledger/fabric`,
            '/var/run/:/host/var/run/',
            `./fabric-data/${`peer${i}.${org.orgName}.com`}:/var/hyperledger/production`,
          ],
          networks: ['test'],
        };

        let couchdbKey = `couchdb${couchDBStart}`;
        let couchdbService = {
          container_name: `couchdb${couchDBStart}`,
          image: 'couchdb:3.1.1',
          environment: ['COUCHDB_USER=admin', 'COUCHDB_PASSWORD=adminpw'],
          ports: [`${couchDBExposedPortStart}:5984`],
          networks: ['test'],
        };

        finalData.services[peerServiceKey] = peerService;
        finalData.services[couchdbKey] = couchdbService;

        couchDBStart += 1;
        firstPeerPort += 1000;
        couchDBExposedPortStart += 1000;
      }
    } else {
      let ordererListenPort = 7050;
      let ordererAdminPort = 7053;
      for (let i = 1; i <= parseInt(org.peerCount); i++) {
        let ordererServiceKey = `orderer${i}.com`;
        let orderer = {
          container_name: `orderer${i}.com`,
          image: 'hyperledger/fabric-orderer:2.5.5',
          environment: [
            'FABRIC_LOGGING_SPEC=INFO',
            'ORDERER_GENERAL_LISTENADDRESS=0.0.0.0',
            `ORDERER_GENERAL_LOCALMSPID=${org.orgName}MSP`,
            'ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp',
            'ORDERER_GENERAL_TLS_ENABLED=true',
            'ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key',
            'ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt',
            'ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]',
            'ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt',
            'ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key',
            'ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]',
            'ORDERER_GENERAL_BOOTSTRAPMETHOD=none',
            'ORDERER_CHANNELPARTICIPATION_ENABLED=true',
            'ORDERER_ADMIN_TLS_ENABLED=true',
            'ORDERER_ADMIN_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt',
            'ORDERER_ADMIN_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key',
            'ORDERER_ADMIN_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]',
            'ORDERER_ADMIN_TLS_CLIENTROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]',
            `ORDERER_GENERAL_LISTENPORT=7050`,
            `ORDERER_ADMIN_LISTENADDRESS=0.0.0.0:${ordererAdminPort}`,
          ],
          working_dir: '/root',
          command: 'orderer',
          ports: [`${ordererListenPort}:7050`, `${ordererAdminPort}:${ordererAdminPort}`],
          networks: ['test'],
          volumes: [
            `./channel/crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/msp:/var/hyperledger/orderer/msp`,
            `./channel/crypto-config/ordererOrganizations/${org.orgName}.com/orderers/orderer${i}.com/tls:/var/hyperledger/orderer/tls`,
            `./fabric-data/orderer${i}:/var/hyperledger/production`,
          ],
        };
        finalData.services[ordererServiceKey] = orderer;
        ordererAdminPort += 1000;
        ordererListenPort += 1000;
      }
    }
  }

  const yamlData = yaml.dump(finalData, { lineWidth: -1 });
  fs.writeFileSync(`${filePath}docker-compose.yaml`, yamlData, 'utf8');
  fs.writeFileSync(`${filePath}.env`, 'COMPOSE_PROJECT_NAME=artifacts', 'utf8');
};

// createServicesDockerComposeFile(staticMasterData)


async function copyDirectory(src, dest) {
  try {
    // Create destination folder if it doesn't exist
    await fs.promises.mkdir(dest, { recursive: true });

    // Read the contents of the source folder
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    // Iterate over each entry in the source directory
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // If it's a folder, recurse
        await copyDirectory(srcPath, destPath);
      } else {
        // If it's a file, copy it
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    console.log('Folder copied successfully!');
  } catch (err) {
    console.error('Error copying folder:', err);
  }
}

const fsp = require('fs/promises');

async function copyDirectory2(src, dest) {
  try {
    await fsp.cp(src, dest, { recursive: true });
    console.log('Folder copied successfully!');
  } catch (err) {
    console.error('Error copying folder:', err);
  }
}

const copyAllStaticFiles = async (userFolder) => {
  // Copy Config folder
  // const sourceFolderRelative = '../../../blockchain/artifacts/channel/config';
  // const sourceFolder = path.resolve(process.cwd(), '../../../blockchain/artifacts/channel/config');
  const sourceFolder = __dirname + '/' + '../../../blockchain/artifacts/channel/config';
  let destinationFolder = `${userFolder}/blockchain/artifacts/channel/config`;

  copyDirectory(sourceFolder, destinationFolder);

  // copy chaincode
  const chaincodeSourceFolder = __dirname + '/' + '../../../blockchain/artifacts/chaincode/javascript';
  let chaincodeDestinationFolder = `${userFolder}/blockchain/artifacts/chaincode/javascript`;
  await copyDirectory2(chaincodeSourceFolder, chaincodeDestinationFolder);

  // copy explorer
  const explorerSourceFolder = __dirname + '/' + '../../../blockchain/Explorer';
  let explorerDestinationFolder = `${userFolder}/blockchain/Explorer`;
  await copyDirectory2(explorerSourceFolder, explorerDestinationFolder);

  // copy performance tools
  const performanceToolsSourceFolder = __dirname + '/' + '../../../blockchain/performance-tool';
  let performanceToolsDestinationFolder = `${userFolder}/blockchain/performance-tool`;
  await copyDirectory2(performanceToolsSourceFolder, performanceToolsDestinationFolder);

  // copy API
  const apiSourceFolder = __dirname + '/' + '../../../api';
  let apiDestinationFolder = `${userFolder}/api`;
  await copyDirectory2(apiSourceFolder, apiDestinationFolder);

}

const addAPIChanges = async (staticMasterData, userFolder) => {

  let generateCCPFile = "#!/bin/bash \n"
  generateCCPFile += "function one_line_pem {\n" +
    "    echo \"`awk 'NF {sub(/\\\\n/, \"\"); printf \"%s\\\\\\\\\\\\\\n\",$0;}' $1`\"\n" +
    "}\n";



  generateCCPFile += `
  function json_ccp {
      local PP=$(one_line_pem $4)
      local CP=$(one_line_pem $5)
      sed -e "s/\\\${ORG}/$1/" \\
          -e "s/\\\${P0PORT}/$2/" \\
          -e "s/\\\${CAPORT}/$3/" \\
          -e "s#\\\${PEERPEM}#$PP#" \\
          -e "s#\\\${CAPEM}#$CP#" \\
          ./ccp-template.json
  }
  `

  let peerOrgs = staticMasterData.Organizations.filter((elm) => elm.orgType == 'Peer');
  // console.log("----peerOrgs-----", peerOrgs)
  let varData = ''
  let caPort = 7054
  for (let org of peerOrgs) {
    varData += `
    
    ORG=${org.orgName}
    P0PORT=${org.peerPorts[0]}
    CAPORT=${caPort}
    PEERPEM=../../blockchain/artifacts/channel/crypto-config/peerOrganizations/${org.orgName}.com/peers/peer1.${org.orgName}.com/tls/tlscacerts/tls-localhost-${caPort}-ca-${org.orgName}-com.pem
    CAPEM=../../blockchain/artifacts/channel/crypto-config/peerOrganizations/${org.orgName}.com/msp/tlscacerts/ca.crt

    echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM )" > connection-${org.orgName}.json
    
    `

    caPort += 1000

  }
  generateCCPFile += "\n" + varData


  let filePath = `${userFolder}/api/connection-profiles`;
  try {
    createFileIfNotExist(filePath);
  } catch (error) {
    console.log("--------error---addAPIChanges----", error)
  }
  fs.writeFileSync(`${filePath}/generate-ccp.sh`, generateCCPFile, 'utf8');

  // Add bootstrap script

  let staticUsers = []
  let staticOrgs = []
  let user;
  let org;

  for (let i = 0; i < peerOrgs.length; i++) {

    user = {
      name: 'max',
      email: `user${i + 1}@gmail.com`,
      orgId: i + 1,
      orgName: peerOrgs[i].orgName,
      password: "Admin@12345",
    }
    staticUsers.push(user)
    org = {
      orgName: peerOrgs[i].orgName, id: i + 1, parentId: 1
    }
    staticOrgs.push(org)
  }



  let bootstrapFile = `
const config = require('../config/config');
const Organization = require('../models/organization.model');
const User = require('../models/user.model');
const { ORG_DEPARTMENT, USER_STATUS, USER_TYPE } = require('./Constants');
const { registerUser } = require('./blockchainUtils');
const staticUser = ${JSON.stringify(staticUsers, null, 2)}

const ingestBootstrapData = async () => {
  const staticOrgData = ${JSON.stringify(staticOrgs, null, 2)}
  
  //org data
  for (let org of staticOrgData) {
    let orgData = await Organization.findOne({ id: org.id });
    if (!orgData) {
      let o = new Organization({
        id: org.id,
        orgName: org.orgName,
        parentId: org.parentId,
      });
      await o.save();
      console.log('Ingesting static org data', org.name);
    } else {
      console.log('organization already exist', org.name);
    }
  }

  //user data
  for (let user of staticUser) {
    let userData = await User.findOne({ email: user.email });
    // console.log('user data is---', userData);
    if (!userData) {
      let newUser = new User({
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        password: user.password,
        status: USER_STATUS.ACTIVE,
        type: USER_TYPE.ADMIN,
      });
      try {
        //Blockchain Registration and Enrollment call
        let secret = await registerUser(\`\${user.orgName}\`, user.email);
        newUser.secret = secret;
        newUser.isVerified = true;
      } catch (error) {
        console.log("-----Error occured while registring user-----", error)
      }
     
      await newUser.save();

      console.log('----ingest static user data--', user.email);
    } else {
      console.log('user email already exist', user.email);
    }
  }
};
module.exports = { ingestBootstrapData, staticUser };
`
  let bootstrapFilePath = `${userFolder}/api/src/utils/bootstrap.js`;

  fs.writeFileSync(bootstrapFilePath, bootstrapFile, 'utf8');

  let firstChannelName = staticMasterData.channels[0].channelName
  let firstChaincodeName = staticMasterData.channels[0].ChaincodeName
  let constantsFile = `
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OTHER: 'other'
}
const USER_TYPE = {
  ADMIN: 'admin',
  USER: 'user'
}
const BLOCKCHAIN_DOC_TYPE = {
  AGREEMENT: 'asset',
  DOCUMENT: 'document'
}
const NETWORK_ARTIFACTS_DEFAULT ={
  CHANNEL_NAME: '${firstChannelName}\',
  CHAINCODE_NAME: '${firstChaincodeName}\',
  QSCC:'qscc'
}
module.exports = {
  USER_STATUS,
  USER_TYPE,
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
}
`

  // /Users/pavanadhav/Documents/Pavan/UdemyCourse/fabric-custom-network/api/src/utils/bootstrap.js
  let constantsFilePath = `${userFolder}/api/src/utils/Constants.js`;
  // try {
  // createFileIfNotExist(constantsFilePath);
  // } catch (error) {
  //   console.log("--------error---addAPIChanges----", error)
  // }
  fs.writeFileSync(constantsFilePath, constantsFile, 'utf8');

}

const addExplorerChanges = async (staticMasterData, userFolder) => {

  let channel = staticMasterData?.channels[0]?.channelName
  let channelFirstOrg = staticMasterData?.channels[0]?.orgName[0]

  let firstPeerOrg = staticMasterData?.Organizations?.find(elm => elm.orgName === channelFirstOrg)

  let data = {
    "name": "first network (ignored)",
    "version": "1.0.0",
    "license": "Apache-2.0",
    "client": {
      "tlsEnable": true,
      "caCredential": {
        "id": "admin",
        "password": "adminpw"
      },
      "adminCredential": {
        "id": "exploreradmin",
        "password": "exploreradminpw",
        "affiliation": `${firstPeerOrg.orgName}.department1`
      },
      "enableAuthentication": true,
      "organization": `${firstPeerOrg.orgName}MSP`,
      "connection": {
        "timeout": {
          "peer": {
            "endorser": "300"
          },
          "orderer": "300"
        }
      }
    },
    "channels": {
      [`${channel}`]: {
        "peers": {
          [`peer1.${firstPeerOrg.orgName}.com`]: {}
        },
        "connection": {
          "timeout": {
            "peer": {
              "endorser": "6000",
              "eventHub": "6000",
              "eventReg": "6000"
            }
          }
        }
      }
    },
    "organizations": {
      [`${firstPeerOrg.orgName}MSP`]: {
        "mspid": `${firstPeerOrg.orgName}MSP`,
        "adminPrivateKey": {
          "path": `/etc/data/peerOrganizations/${firstPeerOrg.orgName}.com/users/Admin@${firstPeerOrg.orgName}.com/msp/keystore/priv_sk`
        },
        "peers": [
          `peer1.${firstPeerOrg.orgName}.com`
        ],
        "signedCert": {
          "path": `/etc/data/peerOrganizations/${firstPeerOrg.orgName}.com/users/Admin@${firstPeerOrg.orgName}.com/msp/signcerts/cert.pem`
        }
      }
    },
    "peers": {
      [`peer1.${firstPeerOrg.orgName}.com`]: {
        "tlsCACerts": {
          "path": `/etc/data/peerOrganizations/${firstPeerOrg.orgName}.com/peers/peer1.${firstPeerOrg.orgName}.com/tls/ca.crt`
        },
        "url": `grpcs://peer1.${firstPeerOrg.orgName}.com:${firstPeerOrg.peerPorts[0]}`,
        "grpcOptions": {
          "ssl-target-name-override": `peer1.${firstPeerOrg.orgName}.com`
        }
      }
    }
  };

  let explorerConnectionDestinationFolder = `${userFolder}/blockchain/Explorer/connection-profile/first-network.json`;

  // Write the JSON content to the file
  fs.writeFileSync(explorerConnectionDestinationFolder, JSON.stringify(data, null, 2), 'utf8');
  console.log('Data written to Explorer connection file successfully!');

}

const addCaliperChanges = async (staticMasterData, userFolder) => {

  let channelName = staticMasterData?.channels[0]?.channelName
  let channelFirstOrg = staticMasterData?.channels[0]?.orgName[0]
  let chaincodeName = staticMasterData?.channels[0]?.ChaincodeName

  let firstPeerOrg = staticMasterData?.Organizations?.find(elm => elm.orgName === channelFirstOrg)

  let networkConfigtFile = {
    "name": "Caliper Benchmarks",
    "version": "2.0.0",
    "caliper": {
      "blockchain": "fabric"
    },
    "info": {
      "Version": "2.1.0",
      "Size": `${staticMasterData?.Organizations?.length} Orgs with 1 Peer`,
      "Orderer": "Raft",
      "Distribution": "Single Host",
      "StateDB": "CouchDB"
    },
    "channels": [
      {
        "channelName": channelName,
        "contracts": [
          {
            "id": chaincodeName
          }
        ]
      }
    ],
    "organizations": [
      {
        "mspid": `${firstPeerOrg.orgName}MSP`,
        "identities": {
          "certificates": [
            {
              "name": "User1",
              "clientPrivateKey": {
                "path": `crypto-config/peerOrganizations/${firstPeerOrg.orgName}.com/users/User1@${firstPeerOrg.orgName}.com/msp/keystore/priv_sk`
              },
              "clientSignedCert": {
                "path": `crypto-config/peerOrganizations/${firstPeerOrg.orgName}.com/users/User1@${firstPeerOrg.orgName}.com/msp/signcerts/cert.pem`
              }
            }
          ]
        },
        "connectionProfile": {
          "path": `crypto-config/peerOrganizations/${firstPeerOrg.orgName}.com/connection-${firstPeerOrg.orgName}.json`,
          "discover": true
        }
      }
    ]
  }

  let caliperNetworkCOnfigFileDestinationFolder = `${userFolder}/blockchain/performance-tool/caliper/caliper-benchmarks-local/networks/network-config.yaml`;

  const yamlData = yaml.dump(networkConfigtFile, { lineWidth: -1 });
  fs.writeFileSync(caliperNetworkCOnfigFileDestinationFolder, yamlData, 'utf8');
  console.log('Data written to Caliper network config file successfully!');



  let createAssetFile = `
    'use strict';

      const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
      const { v1: uuidv4 } = require('uuid')

      let assetIdArray = [];

      class CreateDeviceWorkload extends WorkloadModuleBase {
          constructor() {
              super();
          }

          async submitTransaction() {
              let id = uuidv4()
              assetIdArray.push(id)

              let assetData = {
                  id: id,
                  Color: "White",
                  Size: "Large",
                  Owner: "Pavan",
                  AppraisedValue: "2000000",
              };


              let args = {
                  contractId: "${chaincodeName}",
                  contractVersion: 'v1',
                  contractFunction: 'CreateAsset',
                  contractArguments: [JSON.stringify(assetData)],
                  timeout: 30
              };

              await this.sutAdapter.sendRequests(args);
          }
      }

      function createWorkloadModule() {
          return new CreateDeviceWorkload();
      }

      module.exports.createWorkloadModule = createWorkloadModule;
      module.exports.assetIdArray = assetIdArray;

    `

  let caliperCreateAssetFileDestinationFolder = `${userFolder}/blockchain/performance-tool/caliper/caliper-benchmarks-local/benchmarks/createAsset.js`;
  // Write the JSON content to the file
  fs.writeFileSync(caliperCreateAssetFileDestinationFolder, createAssetFile, 'utf8');
  console.log('Data written to Caliper Create asset file successfully!');


  let queryAssetFile = `
  'use strict';

  const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
  const { assetIdArray } = require('./createAsset');

  class QueryDeviceWorkload extends WorkloadModuleBase {
      constructor() {
          super();
          this.txIndex = 0;
          this.limitIndex = 0;
      }

      async submitTransaction() {
          const randomIndex = Math.floor(Math.random() * assetIdArray.length);

          let assetId= assetIdArray[randomIndex]
          console.log("-----------------------------------", assetId)
          let args = {
              contractId: "${chaincodeName}",
              contractVersion: 'v1',
              contractFunction: 'getAssetByID',
              contractArguments: [assetId],
              timeout: 30,
              readOnly: true
          };

          await this.sutAdapter.sendRequests(args);
      }
  }

  function createWorkloadModule() {
      return new QueryDeviceWorkload();
  }

  module.exports.createWorkloadModule = createWorkloadModule;
  
  `

  let caliperQueryAssetFileDestinationFolder = `${userFolder}/blockchain/performance-tool/caliper/caliper-benchmarks-local/benchmarks/queryAsset.js`;
  // Write the JSON content to the file
  fs.writeFileSync(caliperQueryAssetFileDestinationFolder, queryAssetFile, 'utf8');
  console.log('Data written to Caliper Create asset file successfully!');

}

// copyAllStaticFiles



//Verified-----------
const createEnvVarScript = async (staticMasterData, userFolder) => {
  let ordererOrg = staticMasterData.Organizations.find((elm) => elm.orgType === 'Orderer');
  let ordererCount = ordererOrg.peerCount;

  let filePath = `${userFolder}/blockchain/scripts/`;
  createFileIfNotExist(filePath);

  let helperFunctions = `

C_RESET='\\033[0m'
C_RED='\\033[0;31m'
C_GREEN='\\033[0;32m'
C_BLUE='\\033[0;34m'
C_YELLOW='\\033[1;33m'
# println echos string
function println() {
  echo -e "$1"
}

# errorln echos i red color
function errorln() {
  println "\${C_RED}\${1}\${C_RESET}"
}

# successln echos in green color
function successln() {
  println "\${C_GREEN}\${1}\${C_RESET}"
}

# infoln echos in blue color
function infoln() {
  println "\${C_BLUE}\${1}\${C_RESET}"
}

# warnln echos in yellow color
function warnln() {
  println "\${C_YELLOW}\${1}\${C_RESET}"
}

# fatalln echos in red color and exits with fail status
function fatalln() {
  errorln "$1"
  exit 1
}
`



  // for (let channel of staticMasterData?.channels) {
  let finalContent = `#!/bin/bash
# imports  



export FABRIC_CFG_PATH=\${PWD}/../../blockchain/artifacts/channel/config

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=\${PWD}/../artifacts/channel/crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/orderers/orderer1.com/msp/tlscacerts/tlsca.${ordererOrg.orgName}.com-cert.pem`;

  for (let i = 1; i <= ordererCount; i++) {
    finalContent =
      finalContent +
      '\n' +
      `
    export ORDERER${i}_ADMIN_TLS_SIGN_CERT=\${PWD}/../artifacts/channel/crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/orderers/orderer${i}.com/tls/server.crt
    export ORDERER${i}_ADMIN_TLS_PRIVATE_KEY=\${PWD}/../artifacts/channel/crypto-config/ordererOrganizations/${ordererOrg.orgName}.com/orderers/orderer${i}.com/tls/server.key`;
  }

  let peerOrgs = staticMasterData.Organizations.filter((elm) => elm.orgType !== 'Orderer');

  for (let org of peerOrgs) {
    // for (let i =1; i<=peerOrgs.length;i++){

    finalContent =
      finalContent +
      `
    export ${org.orgName}_CA=\${PWD}/../artifacts/channel/crypto-config/peerOrganizations/${org.orgName}.com/peers/peer1.${org.orgName}.com/tls/ca.crt`;
  }

  finalContent = finalContent + '\n' + helperFunctions + `\n`;

  finalContent =
    finalContent +
    '\n' +
    `
  # Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  local OVERRIDE_PEER=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
    USING_PEER=$2
  else
    USING_ORG="\${OVERRIDE_ORG}"
  fi
  if [ -z "$OVERRIDE_PEER" ]; then
  USING_PEER=$2
  else
    USING_PEER="\${OVERRIDE_PEER}"
  fi
  `;
  // for(let org of peerOrgs){
  // for (let i =1; i<=peerOrgs.length;i++){

  finalContent =
    finalContent +
    '\n' +
    `
  case \$USING_ORG in`;

  for (let i = 1; i <= peerOrgs.length; i++) {
    finalContent += `
        ${peerOrgs[i - 1].orgName})
          export CORE_PEER_LOCALMSPID="${peerOrgs[i - 1].orgName}MSP"
          export CORE_PEER_TLS_ROOTCERT_FILE=\$${peerOrgs[i - 1].orgName}_CA
          export CORE_PEER_MSPCONFIGPATH=\${PWD}/../artifacts/channel/crypto-config/peerOrganizations/${peerOrgs[i - 1].orgName
      }.com/users/Admin@${peerOrgs[i - 1].orgName}.com/msp

          case \$USING_PEER in`;

    for (let j = 0; j < parseInt(peerOrgs[i - 1].peerCount); j++) {
      finalContent += `
              ${j + 1})
                export CORE_PEER_ADDRESS=localhost:${peerOrgs[i - 1].peerPorts[j]} ;;`
    }

    finalContent += `
            default)
              export CORE_PEER_ADDRESS=localhost:${peerOrgs[i - 1].peerPorts[0]}  ;;
            *)
              errorln "Peer number \$USING_PEER is invalid, using default peer ${1}"
              export CORE_PEER_ADDRESS=localhost:${peerOrgs[i - 1].peerPorts[0]} ;;`
    finalContent += `\n          esac ;;`

  }

  finalContent += `
          esac`

  // console.log('-----------');



  finalContent += '\n' + '}';

  fs.writeFileSync(`${filePath}envVar.sh`, finalContent, 'utf8');
};


// createEnvVarScript(staticMasterData)

// Verified-----------
const createChannelScript = async (staticMasterData, userFolder) => {
  let filePath = `${userFolder}/blockchain/scripts/`;
  createFileIfNotExist(filePath);

  for (let channel of staticMasterData?.channels) {
    let finalContent = `#!/bin/bash
# imports  
. envVar.sh
    `;

    CHANNEL_NAME = channel.channelName;

    let ordererOrg = staticMasterData.Organizations.find((elm) => elm.orgType === 'Orderer');
    let ordererCount = ordererOrg.peerCount;

    // let ordererListenPort = 7050;
    let ordererAdminPort = 7053;

    finalContent = finalContent + '\n' + `CHANNEL_NAME=${channel.channelName};`;

    finalContent = finalContent + '\n' + 'createChannel(){';

    let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === channel.orgName[0]);

    // console.log("--------peerOrg-------", peerOrg)
    for (let i = 1; i <= ordererCount; i++) {
      let content = `
      setGlobals ${peerOrg.orgName} 1
      osnadmin channel join --channelID \${CHANNEL_NAME} \\
      --config-block ../channel-artifacts/${CHANNEL_NAME}.block -o localhost:${ordererAdminPort} \\
      --ca-file $ORDERER_CA \\
      --client-cert $ORDERER${i}_ADMIN_TLS_SIGN_CERT \\
      --client-key $ORDERER${i}_ADMIN_TLS_PRIVATE_KEY `;

      finalContent = finalContent + '\n' + content;

      ordererAdminPort += 1000;
    }

    finalContent = finalContent + '\n' + '}' + '\n';
    finalContent = finalContent + '\n' + 'createChannel';
    finalContent = finalContent + '\n' + 'sleep 3';

    finalContent = finalContent + '\n' + 'joinChannel(){';
    for (let org of channel.orgName) {
      let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);
      // console.log("---------------", peerOrg)

      for (let j = 1; j <= parseInt(peerOrg.peerCount); j++) {
        // console.log('-------inside peer----------');
        content = `
        setGlobals ${org} ${j}
        peer channel join -b ../channel-artifacts/${CHANNEL_NAME}.block`;

        finalContent = finalContent + '\n' + content;
      }
    }
    finalContent = finalContent + '\n' + '}' + '\n';
    finalContent = finalContent + '\n' + 'joinChannel' + `\n`;



    // console.log("------", finalContent)

    fs.writeFileSync(`${filePath}create-${channel.channelName}.sh`, finalContent, 'utf8');
  }
};

// createChannelScript(staticMasterData)

const createDeployChaincodeScript = async (staticMasterData, userFolder) => {
  let filePath = `${userFolder}/blockchain/scripts/`;
  createFileIfNotExist(filePath);
  let i = 0;

  let allFunctions = ''

  for (let channel of staticMasterData?.channels) {
    let finalContent = `#!/bin/bash
        # imports  
        . envVar.sh
    `;

    CHANNEL_NAME = channel.channelName;

    let ordererOrg = staticMasterData.Organizations.find((elm) => elm.orgType === 'Orderer');
    let ordererCount = ordererOrg.peerCount;

    // let ordererListenPort = 7050;
    let ordererAdminPort = 7053;

    // finalContent = finalContent + '\n' + 'CHANNEL_NAME = channel.channelName;';

    let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === channel.orgName[0]);

    // -----------------------------
    finalContent =
      finalContent +
      `
        CHANNEL_NAME=${channel.channelName}
        CC_RUNTIME_LANGUAGE="node"
        VERSION="1"
        SEQUENCE=1
        CC_SRC_PATH="../artifacts/chaincode/javascript"
        CC_NAME=${channel.ChaincodeName} \n`;

    // let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);

    finalContent =
      finalContent +
      `
      presetup() {
    echo Installing npm packages ...
    pushd ../artifacts/chaincode/javascript
    npm install
    popd
    echo Finished installing npm dependencies
}

    packageChaincode() {
      rm -rf \${CC_NAME}.tar.gz
      setGlobals ${peerOrg.orgName} 1
      peer lifecycle chaincode package \${CC_NAME}.tar.gz \\
          --path \${CC_SRC_PATH} --lang \${CC_RUNTIME_LANGUAGE} \\
          --label \${CC_NAME}_\${VERSION}
      echo "===================== Chaincode is packaged ===================== "
    }
`;
    allFunctions += 'presetup' + '\n'
    allFunctions += 'packageChaincode' + '\n'
    finalContent = finalContent + '\n' + 'installChaincode() {';
    allFunctions += 'installChaincode' + '\n'
    for (let org of channel.orgName) {
      let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);

      for (let j = 1; j <= parseInt(peerOrg.peerCount); j++) {
        // console.log('-------inside peer----------');
        content = `
        setGlobals ${org} ${j}
        peer lifecycle chaincode install \${CC_NAME}.tar.gz`;

        finalContent = finalContent + '\n' + content;
      }
    }
    finalContent = finalContent + '\n' + '}' + '\n';

    // --------------------------

    finalContent =
      finalContent +
      `
        queryInstalled() {
          setGlobals ${peerOrg.orgName} 1
          peer lifecycle chaincode queryinstalled >&log.txt
          cat log.txt
          PACKAGE_ID=$(sed -n "/\${CC_NAME}_\${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
          echo PackageID is \${PACKAGE_ID}
          echo "===================== Query installed successful on peer0.org1 on channel ===================== "
        }
        `;

    // ----------------------------------
    allFunctions += 'queryInstalled' + '\n'

    for (let org of channel.orgName) {
      // finalContent = finalContent + '\n' + 'installChaincode() {';
      let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);

      finalContent =
        finalContent +
        '\n' +
        `
      approveFor${org}() {
        setGlobals ${peerOrg.orgName} 1
        set -x
        peer lifecycle chaincode approveformyorg -o localhost:7050 \\
            --ordererTLSHostnameOverride orderer1.com --tls \\
            --cafile $ORDERER_CA --channelID \${CHANNEL_NAME} \\
            --name \${CC_NAME} --version \${VERSION} \\
            --package-id \${PACKAGE_ID} \\
            --sequence \${SEQUENCE}
        set +x
    
        echo "===================== chaincode approved from org 1 ===================== "
    
           }
      `;
      allFunctions += `approveFor${org}` + '\n'
    }

    // ---------------------------------------

    // ---------------------------------------

    finalContent =
      finalContent +
      '\n' +
      `
        checkCommitReadyness() {
          setGlobals  ${peerOrg.orgName} 1
          peer lifecycle chaincode checkcommitreadiness \\
              --channelID \${CHANNEL_NAME} --name \${CC_NAME} --version \${VERSION} \\
              --sequence \${SEQUENCE} --output json
          echo "===================== checking commit readyness from org 1 ===================== "
      }
    `;
    allFunctions += `checkCommitReadyness` + '\n'


    // -----------------------------------------

    let peersAddress = '';

    for (let org of channel.orgName) {
      let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);

      for (let j = 1; j <= parseInt(peerOrg.peerCount); j++) {
        // console.log('-------inside peer----------');
        content = `--peerAddresses localhost:${peerOrg.peerPorts[j - 1]} --tlsRootCertFiles \$${peerOrg.orgName}_CA \\
        `;

        peersAddress = peersAddress + content;
      }
    }

    // console.log("------------peersAddress-----------", peersAddress)

    finalContent =
      finalContent +
      '\n' +
      `
    commitChaincodeDefination() {
      setGlobals ${peerOrg.orgName} 1
      peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer1.com \\
          --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \\
          --channelID \${CHANNEL_NAME} --name \${CC_NAME} \\
          --version \${VERSION} --sequence \${SEQUENCE} \\
          ${peersAddress}
  }
    `;

    allFunctions += `commitChaincodeDefination` + '\n'
    // --------------------------------------

    // let peersAddress;

    // for (let org of channel.orgName) {
    //   let peerOrg = staticMasterData.Organizations.find((elm) => elm.orgName === org);

    //   for (let j = 1; j <= parseInt(peerOrg.peerCount); j++) {
    //     console.log('-------inside peer----------');
    //     content = `
    //     --peerAddresses localhost:${peerOrg.peerPorts[j - 1]} --tlsRootCertFiles ${peerOrg.orgName}_CA \\
    //     `;

    //     peersAddress = finalContent + '\n' + content;
    //   }
    // }

    finalContent =
      finalContent +
      '\n' +
      `
    chaincodeInvoke() {
      setGlobals ${peerOrg.orgName} 1
  
      # Create Car
      peer chaincode invoke -o localhost:7050 \\
          --ordererTLSHostnameOverride orderer1.com \\
          --tls $CORE_PEER_TLS_ENABLED \\
          --cafile $ORDERER_CA \\
          -C \${CHANNEL_NAME} -n \${CC_NAME}  \\
          -c '{"function": "CreateAsset","Args":["{\\"id\\":\\"6\\", \\"test\\":\\"updated data\\"}"]}' \\
          ${peersAddress}
          
  }
    `;

    allFunctions += `chaincodeInvoke` + '\n'
    allFunctions += `sleep 3` + '\n'
    // --------------------------------------

    finalContent =
      finalContent +
      '\n' +
      `
  chaincodeQuery() {
    setGlobals ${peerOrg.orgName} 1
    peer chaincode query -C \${CHANNEL_NAME} -n \${CC_NAME} -c '{"function": "getAssetByID","Args":["6"]}'
}
    `;

    allFunctions += `chaincodeQuery` + '\n'

    finalContent =
      finalContent +
      '\n' + allFunctions
    // -----------------------------------------

    // console.log('-----------');

    fs.writeFileSync(`${filePath}deploy-${channel.ChaincodeName}.sh`, finalContent, 'utf8');
  }
};

// createDeployChaincodeScript(staticMasterData);

// const fs = require('fs');
const archiver = require('archiver');
// const path = require('path');

const createZipFile = async (userFolder, outputPath) => {

  // const folderToZip = path.join(__dirname, 'your-folder-name');  // Replace with your folder
  const zipFilePath = userFolder + new Date() + '.zip'//path.join(__dirname, 'output.zip');        // Output ZIP file path

  // createZip(userFolder, zipFilePath);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // Listen for all archive data to be written.
  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log('ZIP file has been finalized and the output file descriptor has closed.');
  });

  // Catch any warnings (e.g., stat failures) or errors.
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('Warning:', err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  // Pipe archive data to the file.
  archive.pipe(output);

  // Append files from the specified folder.
  archive.directory(userFolder, false);

  // Finalize the archive (i.e., no more files will be added).
  archive.finalize();
}


const initiateProjectCreation = async (staticMasterData, email, networkName) => {

  try {
    const userFolder = getFinalFolder(projectName, email, networkName)
    console.log("------userFolder----", userFolder)
    await createUserProject(email, networkName)
    await createCADockerComposeFile(staticMasterData, userFolder)
    await createCryptoConfigScript(staticMasterData, userFolder);
    await createConfigTxFile(staticMasterData, userFolder)
    await createArtifacts(staticMasterData, userFolder)
    await createServicesDockerComposeFile(staticMasterData, userFolder)
    await copyAllStaticFiles(userFolder)
    await addAPIChanges(staticMasterData, userFolder)
    await addExplorerChanges(staticMasterData, userFolder)
    await addCaliperChanges(staticMasterData, userFolder)
    await createEnvVarScript(staticMasterData, userFolder)
    await createChannelScript(staticMasterData, userFolder)
    await createDeployChaincodeScript(staticMasterData, userFolder);

    await createZipFile(userFolder, `${__dirname}/${projectName}/${email}/${networkName}.zip`)
  } catch (error) {

    console.log("--------error--------", error)
  }



}

// initiateProjectCreation(staticMasterData, 'adhavpavan@gmail.com', 'testNetwork2')



module.exports = {
  initiateProjectCreation
}