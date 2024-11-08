

Standard Steps for creating any blockchain network
1) CA Creation
2) cryptomaterial creation
3) Create artifacts
4) Run all services
5) Create Channel
7) Deploy Chaincode





Downloaded zip have following folders
1) api
2) blockchain
    1) artifacts
    2) Explorer
    3) performance-tool
    4) scripts

api        --> Basic working api structure for CRUD operation
blockchain --> All blockchain network related files
artifacts  --> Blockchain network configuration for all services
Explorer   --> Blockchain Explorer running code
performace-tools  --> Basic caliper working configuration 
scripts    --> Blockchain script for channel creation and chaincode deployment

Note: Please make sure to go through my youtub video to run network and make changes as per your need.


Steps to create network and integrate api, caliper, explorer

Blockchain Network

    1) Go to homw folder and run --> `sudo chmod -R 777 *`
    2) Go to folder `blockchain/artifacts/channel/create-certificate-with-ca`
    2) run --> `docker-compose up -d`
    4) run --> `./create-certificate-with-ca.sh`
    5) Go back --> `cd ../`
    6) Now we are in channel folder
    7) run --> ./create-artifacts.sh
    8) Go back --> `cd ../`
    9) Now we are in artifacts folder
    10) run --> `docker-compose up -d`
    11) Go to script folder  --> `cd ../scripts`
    12) You may have multiple files here as per configuration defined, let try creating one channel and deploy chaincode
    13) run --> `./create-mychannel1.sh`
    14) run --> `./deploy-chaincode1.sh`
    15) You will be able to see couchdb on browser --> `http://127.0.0.1:5984/_utils/`
    16) Use username:admin password:adminpw for accessing first org, first peer couchdb

Explorer
    1) Go to blockchain/Explorer folder --> `cd Explorer`
    2) run --> `docker-compose up -d`
    3) Go to browser and open localhost:8081
    4) Use username:exploreradmin password:exploreradminpw 
    5) You sould be able to see blockchain explorer

Caliper
    1) Go to blockchain/performance-tool/caliper folder  --> cd performance-tool/caliper folder
    2) Go to caliper-benchmarks-local folder  --> cd caliper-benchmarks-local
    3) run --> npm install
    4) cd back to caliper folder --> `cd ..`
    5) run --> `docker-compose up -d`
    6) As per basic smart contract definded, caliper will start invoking and quering transaction to blockchain network
    7) We can check log `docker logs caliper -f`
    8) Once done with benchmark, report.html will get created, you can check and open in browser.

API
    1) Go to api folder, --> `cd api`
    2) run npm install
    3) There is .env.sample file inside api folder, please add mongodb credential in that file
    3) install nodemon  --> `sudo npm i -g nodemon`
    4) run --> nodemon app.js
    6) Server will be running on localhost:3000
    7) After stating server, There is data seeding script in bootstrap.js, it will ingest organization and user in mongodb, parallel, it create user credentials(wallet) using CA and store user id in wallet folder.
    7) There is postman folder at path : `api/src/postman`, inside i have added api collection for interacting with blockchain network through api


Note:
    Explorer, Caliper are configured on the behalf on first channel of first organization, feel free to make any changes
    For API, we have created connection configuration for all orgs, user can switch between orgs using different users defined in bootstrap.js file