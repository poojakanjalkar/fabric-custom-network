const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/org.controller');
const { auth } = require('../../middlewares/auth');
const { validateSubscription } = require('../../middlewares/validateSubscription');
const validate = require('../../middlewares/validate');
const { requestSchema } = require('../../middlewares/request.validations');

router.get('/download/:projectId', auth, orgController.downloadFile);
router.get('/', auth, orgController.getAllOrganizations);
router.get('/:id', auth, orgController.getOrganizationById);
router.post('/', auth, validate(requestSchema) ,validateSubscription, orgController.createOrganization);
router.put('/:id', auth, orgController.updateOrganization);
router.delete('/:id', auth, orgController.deleteOrganization);

module.exports = router;
