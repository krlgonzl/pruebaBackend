const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');

router.post('/trasladar', movimientoController.realizarTraslado);
router.get('/', movimientoController.getMovimientos);
router.get('/activo/:id', movimientoController.getMovimientosByAsset);

module.exports = router;