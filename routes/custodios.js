const express = require('express');
const router = express.Router();
const custodioController = require('../controllers/custodioController');

router.post('/', custodioController.createCustodio);
router.get('/', custodioController.getCustodios);
router.get('/por-area/:areaId', custodioController.getCustodiosByArea);
router.get('/:id', custodioController.getCustodioById);
router.put('/:id', custodioController.updateCustodio);
router.delete('/:id', custodioController.deleteCustodio);

module.exports = router;