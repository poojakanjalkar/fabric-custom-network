const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/org.controller');
const { auth } = require('../../middlewares/auth');

router.get('/', auth, orgController.getAllOrganizations);
router.get('/:id', auth, orgController.getOrganizationById);
router.post('/', auth, orgController.createOrganization);
router.put('/:id', auth, orgController.updateOrganization);
router.delete('/:id', auth, orgController.deleteOrganization);

module.exports = router;
