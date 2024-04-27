const Org = require('../models/org.model');

const getAllOrganizations = async (req, res) => {
  const organizations = await Org.find();
  res.json(organizations);
};

const getOrganizationById = async (req, res) => {
  const organization = await Org.findById(req.params.id);
  if (organization) {
    res.json(organization);
  } else {
    res.status(404).json({ message: 'Organization not found' });
  }
};

const createOrganization = async (req, res) => {
  const newOrganization = new Org(req.body);
  const savedOrganization = await newOrganization.save();
  res.status(201).json(savedOrganization);
};

const updateOrganization = async (req, res) => {
  const updatedOrganization = await Org.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedOrganization);
};

const deleteOrganization = async (req, res) => {
  await Org.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
