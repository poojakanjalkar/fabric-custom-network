const express = require('express');
const { getAllCattle, createCattle, updateCattle, getCattleById } = require('../../controllers/cattle.controller');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, getAllCattle);
router.post('/', auth, createCattle);
router.get('/:id', auth, getCattleById);
router.put('/:id', auth, updateCattle);
module.exports = router;
