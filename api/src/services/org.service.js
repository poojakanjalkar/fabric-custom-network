const { initiateProjectCreation } = require('../jobs/createProject');
const Org = require('../models/org.model');
const Subscription = require('../models/subscription.model');
const { REQUEST_STATUS } = require('../utils/Constants');

const getAllOrganizations = async (options, filter) => {
  console.log('++++++options+++++', options);
  const result = await Org.find({});
  console.log('________', result);
  return Org.paginate(filter, options);
};

const getOrganizationById = async (id) => {
  return Org.findById(id);
};

const getModifiedObject = (data)=> {

  let peerPorts = 7051

  let orgs = data.filter(elm => elm.orgType == "Peer")
  let ordererOrg = data.filter(elm => elm.orgType != "Peer")

  let o = []
  let ports= []

  for (let a =0; a< orgs.length; a++){
    ports= []
    let org = orgs[a]
    for(let b =1; b<=org.peerCount; b++){
      ports.push(peerPorts)
      peerPorts += 1000
    }
    org.peerPorts = ports
    o.push(org)
  }

  console.log("----------ordererOrg-----------", ordererOrg)

  console.log("-------------o--------", o )

  return [...o, ...ordererOrg]

  // for (let a =0; a< orgs.length; a++){
  //   let org  = orgs[a].peerPorts
  // }

  // orgs = orgs.map(elm => {
  //   peerPorts += 1000
  //   return {
  //     ...elm,
  //     peerPorts
  //   }
  // })

}

const createOrganization = async (data, user) => {
  console.log('--service data----', data);
  let requestModel = {
    configuration: data,
    createdBy: user.email,
    updatedBy: user.email,
    userId: user.email,
    status: REQUEST_STATUS.SUBMIT,
  };
  const res = await Subscription.updateOne(
    { email: user.email, credit: { $gt: 0 } }, // Ensure there are enough credits
    { $inc: { credit: -1 } }
  ).exec();

  console.log('+++++++geting subscription res---', res);
  const organization = new Org(requestModel);

  let modifiedPorts = getModifiedObject(data.Organizations)
  data.Organizations = modifiedPorts

  console.log("------------data---------", data)

  initiateProjectCreation(data, "adhavpavan@gmail.com", 'test6')


  return organization.save();
};

const updateOrganization = async (id, newData) => {
  return Org.findByIdAndUpdate(id, newData, { new: true });
};

const deleteOrganization = async (id) => {
  return Org.findByIdAndDelete(id);
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
