const express = require('express');
const router = express.Router();
const slaughterController = require('../../controllers/slaughter.controller');
const { auth } = require('../../middlewares/auth');

router.get('/', auth, slaughterController.getAll);
router.get('/:id', auth, slaughterController.getById);
router.post('/', auth, slaughterController.create);

module.exports = router;
