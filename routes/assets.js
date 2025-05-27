
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros
router.get('/filter', assetController.filterAssets);
router.get('/recent/grouped', assetController.getRecentAssetsGroupedByCategory);
router.get('/valor-por-area', assetController.getValorTotalPorArea);

// CRUD básico
router.post('/', assetController.createAsset);
router.get('/', assetController.getAssets);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;