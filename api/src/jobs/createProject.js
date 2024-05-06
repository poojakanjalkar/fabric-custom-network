const fs = require('fs');
const { staticMasterData } = require('../data/conf');
const yaml = require('js-yaml');

const projectName = './Project123';

const firstCAPort = 7054;

const createProject = (data1) => {
  //

  const data = staticMasterData;
  console.log(data);
  // const projectName = './Project123';
  if (fs.existsSync(projectName)) {
    fs.mkdirSync(projectName, { recursive: true });
  }
};

const createFileIfNotExist = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
};

const createConfigtxFile = () => {};

// docker-compose file for CA

const createCADockerComposeFile = (staticMasterData) => {
  let finalData = {
    version: '2.1',
    networks: {
      test: null,
    },
    services: {},
  };

  let filePath = `${projectName}/blockchain/artifacts/channel/create-certificate-with-ca/`;
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
};

//1
createCADockerComposeFile(staticMasterData);

// 2
const createCryptoConfigScript = (staticMasterData) => {
  let filePath = `${projectName}/blockchain/artifacts/channel/create-certificate-with-ca/`;

  let finalContent = `#!/bin/bash
echo "Hello, this is a shell script created with Node.js!"
`;

  let caPort = firstCAPort;

  for (let org of staticMasterData?.Organizations) {
    if (org.orgType === 'Peer') {
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
        peersContent = peersContent + '\n' + c2 + +'\n';
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
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.${org.orgName}.com --id.name ${org.orgName}admin --id.secret ${org.orgName}adminpw --id.type admin --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/${org.orgName}.com/orderers
  
  
    `;

      let orderersContent = '';
      for (let i = 1; i <= parseInt(org.peerCount); i++) {
        let c2 = '';
        c2 = `
      echo
      echo "Register ${org.orgName}"
      echo
       
      fabric-ca-client register --caname ca-${org.orgName} --id.name ${org.orgName} --id.secret ${org.orgName}pw --id.type ${org.orgName} --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
       
      # ---------------------------------------------------------------------------
      #  ${org.orgName}

      mkdir -p ../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com

      echo
      echo "## Generate the  ${org.orgName} msp"
      echo
      
      fabric-ca-client enroll -u https://${org.orgName}:${org.orgName}pw@localhost:${caPort} --caname ca-${org.orgName} -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/msp --csr.hosts ${org.orgName}.com --csr.hosts localhost --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/msp/config.yaml \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/msp/config.yaml

      echo
      echo "## Generate the orderer${i}-tls certificates"
      echo
      
      fabric-ca-client enroll -u https://orderer${i}:orderer${i}pw@localhost:${caPort} --caname ca-${org.orgName} -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls --enrollment.profile tls --csr.hosts ${org.orgName}.com --csr.hosts localhost --tls.certfiles \${PWD}/fabric-ca/ordererOrg/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/ca.crt
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/signcerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/server.crt
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/keystore/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/server.key

      mkdir \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/msp/tlscacerts
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/msp/tlscacerts/tlsca.${org.orgName}-cert.pem

      mkdir \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/msp/tlscacerts
      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/orderers/orderer${i}.com/tls/tlscacerts/* \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}/msp/tlscacerts/tlsca.${org.orgName}-cert.pem

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
      
      fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp --tls.certfiles \${PWD}/fabric-ca/${org.orgName}/tls-cert.pem
      

      cp \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/msp/config.yaml \${PWD}/../crypto-config/ordererOrganizations/${org.orgName}.com/users/Admin@${org.orgName}.com/msp/config.yaml

        `;

      finalContent = finalContent + '\n' + orgRegistrationContent + orderersContent + userMSP + '\n' + '}';

      caPort += 1000;
    }
  }

  // const yamlData = yaml.dump(finalData);
  fs.writeFileSync(`${filePath}create-certificate-with-ca.sh`, finalContent, 'utf8');
};

//2
// createCryptoConfigScript(staticMasterData);

// createProject()
