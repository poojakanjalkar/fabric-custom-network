const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/org.controller');

router.get('/', orgController.getAllOrganizations);
router.get('/:id', orgController.getOrganizationById);
router.post('/', orgController.createOrganization);
router.put('/:id', orgController.updateOrganization);
router.delete('/:id', orgController.deleteOrganization);

module.exports = router;
