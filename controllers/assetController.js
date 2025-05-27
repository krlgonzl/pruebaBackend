const { Asset, Custodio, Area, Movimiento } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.createAsset = async (req, res) => {
  try {
    const { name, description, valor, category, custodio_id } = req.body;
    
    if (!name || !custodio_id) {
      return res.status(400).json({ 
        error: 'El nombre y custodio son requeridos' 
      });
    }
    
    // Verificar que el custodio existe
    const custodio = await Custodio.findByPk(custodio_id);
    if (!custodio) {
      return res.status(400).json({ error: 'El custodio especificado no existe' });
    }
    
    const asset = await Asset.create({
      name,
      description,
      valor,
      category,
      custodio_id,
      status: 'activo'
    });
    
    // Retornar con información completa
    const assetCompleto = await Asset.findByPk(asset.id, {
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }]
    });
    
    res.status(201).json(assetCompleto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { deleted_at: null },
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }]
    });
    
    if (!asset) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { custodio_id } = req.body;
    
    // Si se cambia el custodio, verificar que existe
    if (custodio_id) {
      const custodio = await Custodio.findByPk(custodio_id);
      if (!custodio) {
        return res.status(400).json({ error: 'El custodio especificado no existe' });
      }
    }
    
    const [updated] = await Asset.update(req.body, {
      where: { id: req.params.id, deleted_at: null }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Activo no encontrado o eliminado' });
    }
    
    const updatedAsset = await Asset.findByPk(req.params.id, {
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }]
    });
    
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const [updated] = await Asset.update(
      { 
        deleted_at: new Date(), 
        status: 'dado de baja' 
      },
      { where: { id: req.params.id, deleted_at: null } }
    );
    
    if (!updated) {
      return res.status(404).json({ 
        message: 'Activo no encontrado o ya eliminado' 
      });
    }
    
    res.json({ message: 'Activo dado de baja exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterAssets = async (req, res) => {
  try {
    const { status, category, from, to } = req.query;
    
    const where = { deleted_at: null };
    
    if (status) where.status = status;
    if (category) where.category = category;
    
    if (from && to) {
      where.created_at = { [Op.between]: [new Date(from), new Date(to)] };
    } else if (from) {
      where.created_at = { [Op.gte]: new Date(from) };
    } else if (to) {
      where.created_at = { [Op.lte]: new Date(to) };
    }
    
    const assets = await Asset.findAll({
      where,
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json(assets);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al filtrar activos', 
      error: error.message 
    });
  }
};

exports.getRecentAssetsGroupedByCategory = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    const assets = await Asset.findAll({
      where: {
        deleted_at: null,
        created_at: { [Op.gte]: lastMonth }
      },
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }],
      order: [['created_at', 'DESC']]
    });
    
    const groupedByCategory = assets.reduce((acc, asset) => {
      const cat = asset.category || 'Sin categoría';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(asset);
      return acc;
    }, {});
    
    res.json(groupedByCategory);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener activos recientes',
      error: error.message
    });
  }
};

exports.getValorTotalPorArea = async (req, res) => {
  try {
    const resultados = await Asset.findAll({
      attributes: [
        [fn('SUM', col('Asset.valor')), 'total_valor'],
        [fn('COUNT', col('Asset.id')), 'cantidad_activos']
      ],
      include: [{
        model: Custodio,
        as: 'custodio',
        attributes: [],
        include: [{
          model: Area,
          as: 'area',
          attributes: ['id', 'name']
        }]
      }],
      where: { deleted_at: null },
      group: ['custodio.area.id', 'custodio.area.name'],
      order: [[fn('SUM', col('Asset.valor')), 'DESC']]
    });
    
    res.json(resultados);
  } catch (error) {
    res.status(500).json({
      message: 'Error al calcular el valor total por área',
      error: error.message
    });
  }
};