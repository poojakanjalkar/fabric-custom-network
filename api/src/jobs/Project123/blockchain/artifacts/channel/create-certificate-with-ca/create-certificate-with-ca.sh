#!/bin/bash
echo "Hello, this is a shell script created with Node.js!"


    CreateCertificatesForOrderer() {

    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/Orderer.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/Orderer.com/

    fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca.Orderer.com --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-7054-ca-Orderer-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-7054-ca-Orderer-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-7054-ca-Orderer-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-7054-ca-Orderer-com.pem
      OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/Orderer.com/msp/config.yaml
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.Orderer.com --id.name Ordereradmin --id.secret Ordereradminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/Orderer.com/orderers
  
  
    

      echo
      echo "Register Orderer"
      echo
       
      fabric-ca-client register --caname ca-Orderer --id.name Orderer --id.secret Ordererpw --id.type Orderer --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
       
      # ---------------------------------------------------------------------------
      #  Orderer

      mkdir -p ../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com

      echo
      echo "## Generate the  Orderer msp"
      echo
      
      fabric-ca-client enroll -u https://Orderer:Ordererpw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/msp --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/msp/config.yaml

      echo
      echo "## Generate the orderer1-tls certificates"
      echo
      
      fabric-ca-client enroll -u https://orderer1:orderer1pw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls --enrollment.profile tls --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/ca.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/server.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/server.key

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/msp/tlscacerts/tlsca.Orderer-cert.pem

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer1.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts/tlsca.Orderer-cert.pem

      


      echo
      echo "Register Orderer"
      echo
       
      fabric-ca-client register --caname ca-Orderer --id.name Orderer --id.secret Ordererpw --id.type Orderer --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
       
      # ---------------------------------------------------------------------------
      #  Orderer

      mkdir -p ../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com

      echo
      echo "## Generate the  Orderer msp"
      echo
      
      fabric-ca-client enroll -u https://Orderer:Ordererpw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/msp --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/msp/config.yaml

      echo
      echo "## Generate the orderer2-tls certificates"
      echo
      
      fabric-ca-client enroll -u https://orderer2:orderer2pw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls --enrollment.profile tls --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/ca.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/server.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/server.key

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/msp/tlscacerts/tlsca.Orderer-cert.pem

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer2.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts/tlsca.Orderer-cert.pem

      


      echo
      echo "Register Orderer"
      echo
       
      fabric-ca-client register --caname ca-Orderer --id.name Orderer --id.secret Ordererpw --id.type Orderer --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
       
      # ---------------------------------------------------------------------------
      #  Orderer

      mkdir -p ../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com

      echo
      echo "## Generate the  Orderer msp"
      echo
      
      fabric-ca-client enroll -u https://Orderer:Ordererpw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/msp --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/msp/config.yaml

      echo
      echo "## Generate the orderer3-tls certificates"
      echo
      
      fabric-ca-client enroll -u https://orderer3:orderer3pw@localhost:7054 --caname ca-Orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls --enrollment.profile tls --csr.hosts Orderer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/ca.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/server.crt
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/server.key

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/msp/tlscacerts/tlsca.Orderer-cert.pem

      mkdir ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts
      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer/orderers/orderer3.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/Orderer/msp/tlscacerts/tlsca.Orderer-cert.pem

      


      mkdir -p ../crypto-config/ordererOrganizations/Orderer.com/users
      mkdir -p ../crypto-config/ordererOrganizations/Orderer.com/users/Admin@Orderer.com

      echo
      echo "## Generate the admin msp"
      echo
      
      fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/Orderer.com/users/Admin@Orderer.com/msp --tls.certfiles ${PWD}/fabric-ca/Orderer/tls-cert.pem
      

      cp ${PWD}/../crypto-config/ordererOrganizations/Orderer.com/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/Orderer.com/users/Admin@Orderer.com/msp/config.yaml

        
}

    CreateCertificatesForOrg1() {
  
    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/Org1.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/Org1.com/
  
  
     
    fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca.Org1.com --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
     
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-8054-ca-Org1-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-8054-ca-Org1-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-8054-ca-Org1-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-8054-ca-Org1-com.pem
      OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/Org1.com/msp/config.yaml
  
    echo
    echo "Register user"
    echo
    fabric-ca-client register --caname ca.Org1.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.Org1.com --id.name Org1admin --id.secret Org1adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/Org1.com/peers
  
  
  
  
    


      echo
      echo "Register peer1"
      echo
      fabric-ca-client register --caname ca.Org1.com --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
    
      
      echo
      echo "## Generate the peer1-tls certificates"
      echo
      fabric-ca-client enroll -u https://peer1:peer1pw@localhost:8054 --caname ca.Org1.com -M ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls --enrollment.profile tls --csr.hosts peer1.Org1.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
  
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/ca.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/server.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/server.key
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org1.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/msp/tlscacerts/ca.crt
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org1.com/tlsca
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/tlsca/tlsca.Org1.com-cert.pem
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org1.com/ca
      cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/peers/peer1.Org1.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/ca/ca.Org1.com-cert.pem
  
      # --------------------------------------------------------------------------------------------------
  
      mkdir -p ../crypto-config/peerOrganizations/Org1.com/users
      mkdir -p ../crypto-config/peerOrganizations/Org1.com/users/User1@Org1.com
   
  
      0

  
    mkdir -p ../crypto-config/peerOrganizations/Org1.com/users
    mkdir -p ../crypto-config/peerOrganizations/Org1.com/users/User1@Org1.com
  
    echo
    echo "## Generate the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca.Org1.com -M ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/User1@Org1.com/msp --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/User1@Org1.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/User1@Org1.com/msp/keystore/priv_sk
    mkdir -p ../crypto-config/peerOrganizations/Org1.com/users/Admin@Org1.com
  
    echo
    echo "## Generate the org admin msp"
    echo
    fabric-ca-client enroll -u https://Org1admin:Org1adminpw@localhost:8054 --caname ca.Org1.com -M ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/Admin@Org1.com/msp --tls.certfiles ${PWD}/fabric-ca/Org1/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/Admin@Org1.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/Admin@Org1.com/msp/keystore/priv_sk
    cp ${PWD}/../crypto-config/peerOrganizations/Org1.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/Org1.com/users/Admin@Org1.com/msp/config.yaml
  
    
}

    CreateCertificatesForOrg2() {
  
    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/Org2.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/Org2.com/
  
  
     
    fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca.Org2.com --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
     
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-9054-ca-Org2-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-9054-ca-Org2-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-9054-ca-Org2-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-9054-ca-Org2-com.pem
      OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/Org2.com/msp/config.yaml
  
    echo
    echo "Register user"
    echo
    fabric-ca-client register --caname ca.Org2.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.Org2.com --id.name Org2admin --id.secret Org2adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/Org2.com/peers
  
  
  
  
    


      echo
      echo "Register peer1"
      echo
      fabric-ca-client register --caname ca.Org2.com --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
    
      
      echo
      echo "## Generate the peer1-tls certificates"
      echo
      fabric-ca-client enroll -u https://peer1:peer1pw@localhost:9054 --caname ca.Org2.com -M ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls --enrollment.profile tls --csr.hosts peer1.Org2.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
  
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/ca.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/server.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/server.key
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org2.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/msp/tlscacerts/ca.crt
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org2.com/tlsca
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/tlsca/tlsca.Org2.com-cert.pem
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org2.com/ca
      cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/peers/peer1.Org2.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/ca/ca.Org2.com-cert.pem
  
      # --------------------------------------------------------------------------------------------------
  
      mkdir -p ../crypto-config/peerOrganizations/Org2.com/users
      mkdir -p ../crypto-config/peerOrganizations/Org2.com/users/User1@Org2.com
   
  
      0

  
    mkdir -p ../crypto-config/peerOrganizations/Org2.com/users
    mkdir -p ../crypto-config/peerOrganizations/Org2.com/users/User1@Org2.com
  
    echo
    echo "## Generate the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:9054 --caname ca.Org2.com -M ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/User1@Org2.com/msp --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/User1@Org2.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/User1@Org2.com/msp/keystore/priv_sk
    mkdir -p ../crypto-config/peerOrganizations/Org2.com/users/Admin@Org2.com
  
    echo
    echo "## Generate the org admin msp"
    echo
    fabric-ca-client enroll -u https://Org2admin:Org2adminpw@localhost:9054 --caname ca.Org2.com -M ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/Admin@Org2.com/msp --tls.certfiles ${PWD}/fabric-ca/Org2/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/Admin@Org2.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/Admin@Org2.com/msp/keystore/priv_sk
    cp ${PWD}/../crypto-config/peerOrganizations/Org2.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/Org2.com/users/Admin@Org2.com/msp/config.yaml
  
    
}

    CreateCertificatesForOrg3() {
  
    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/Org3.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/Org3.com/
  
  
     
    fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca.Org3.com --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
     
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-10054-ca-Org3-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-10054-ca-Org3-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-10054-ca-Org3-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-10054-ca-Org3-com.pem
      OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/Org3.com/msp/config.yaml
  
    echo
    echo "Register user"
    echo
    fabric-ca-client register --caname ca.Org3.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.Org3.com --id.name Org3admin --id.secret Org3adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/Org3.com/peers
  
  
  
  
    


      echo
      echo "Register peer1"
      echo
      fabric-ca-client register --caname ca.Org3.com --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
    
      
      echo
      echo "## Generate the peer1-tls certificates"
      echo
      fabric-ca-client enroll -u https://peer1:peer1pw@localhost:10054 --caname ca.Org3.com -M ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls --enrollment.profile tls --csr.hosts peer1.Org3.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
  
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/ca.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/server.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/server.key
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org3.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/msp/tlscacerts/ca.crt
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org3.com/tlsca
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/tlsca/tlsca.Org3.com-cert.pem
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org3.com/ca
      cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/peers/peer1.Org3.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/ca/ca.Org3.com-cert.pem
  
      # --------------------------------------------------------------------------------------------------
  
      mkdir -p ../crypto-config/peerOrganizations/Org3.com/users
      mkdir -p ../crypto-config/peerOrganizations/Org3.com/users/User1@Org3.com
   
  
      0

  
    mkdir -p ../crypto-config/peerOrganizations/Org3.com/users
    mkdir -p ../crypto-config/peerOrganizations/Org3.com/users/User1@Org3.com
  
    echo
    echo "## Generate the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:10054 --caname ca.Org3.com -M ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/User1@Org3.com/msp --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/User1@Org3.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/User1@Org3.com/msp/keystore/priv_sk
    mkdir -p ../crypto-config/peerOrganizations/Org3.com/users/Admin@Org3.com
  
    echo
    echo "## Generate the org admin msp"
    echo
    fabric-ca-client enroll -u https://Org3admin:Org3adminpw@localhost:10054 --caname ca.Org3.com -M ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/Admin@Org3.com/msp --tls.certfiles ${PWD}/fabric-ca/Org3/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/Admin@Org3.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/Admin@Org3.com/msp/keystore/priv_sk
    cp ${PWD}/../crypto-config/peerOrganizations/Org3.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/Org3.com/users/Admin@Org3.com/msp/config.yaml
  
    
}

    CreateCertificatesForOrg4() {
  
    echo
    echo "Enroll the CA admin"
    echo
    mkdir -p ../crypto-config/peerOrganizations/Org4.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/Org4.com/
  
  
     
    fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca.Org4.com --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
     
  
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/localhost-11054-ca-Org4-com.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/localhost-11054-ca-Org4-com.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/localhost-11054-ca-Org4-com.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/localhost-11054-ca-Org4-com.pem
      OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/Org4.com/msp/config.yaml
  
    echo
    echo "Register user"
    echo
    fabric-ca-client register --caname ca.Org4.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
  
    echo
    echo "Register the org admin"
    echo
    fabric-ca-client register --caname ca.Org4.com --id.name Org4admin --id.secret Org4adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
  
    mkdir -p ../crypto-config/peerOrganizations/Org4.com/peers
  
  
  
  
    


      echo
      echo "Register peer1"
      echo
      fabric-ca-client register --caname ca.Org4.com --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
    
      
      echo
      echo "## Generate the peer1-tls certificates"
      echo
      fabric-ca-client enroll -u https://peer1:peer1pw@localhost:11054 --caname ca.Org4.com -M ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls --enrollment.profile tls --csr.hosts peer1.Org4.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
  
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/ca.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/server.crt
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/server.key
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org4.com/msp/tlscacerts
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/msp/tlscacerts/ca.crt
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org4.com/tlsca
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/tlsca/tlsca.Org4.com-cert.pem
  
      mkdir ${PWD}/../crypto-config/peerOrganizations/Org4.com/ca
      cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/peers/peer1.Org4.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/ca/ca.Org4.com-cert.pem
  
      # --------------------------------------------------------------------------------------------------
  
      mkdir -p ../crypto-config/peerOrganizations/Org4.com/users
      mkdir -p ../crypto-config/peerOrganizations/Org4.com/users/User1@Org4.com
   
  
      0

  
    mkdir -p ../crypto-config/peerOrganizations/Org4.com/users
    mkdir -p ../crypto-config/peerOrganizations/Org4.com/users/User1@Org4.com
  
    echo
    echo "## Generate the user msp"
    echo
    fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca.Org4.com -M ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/User1@Org4.com/msp --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/User1@Org4.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/User1@Org4.com/msp/keystore/priv_sk
    mkdir -p ../crypto-config/peerOrganizations/Org4.com/users/Admin@Org4.com
  
    echo
    echo "## Generate the org admin msp"
    echo
    fabric-ca-client enroll -u https://Org4admin:Org4adminpw@localhost:11054 --caname ca.Org4.com -M ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/Admin@Org4.com/msp --tls.certfiles ${PWD}/fabric-ca/Org4/tls-cert.pem
    cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/Admin@Org4.com/msp/keystore/* ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/Admin@Org4.com/msp/keystore/priv_sk
    cp ${PWD}/../crypto-config/peerOrganizations/Org4.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/Org4.com/users/Admin@Org4.com/msp/config.yaml
  
    
}