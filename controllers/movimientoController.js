const { Movimiento, Asset, Custodio, Area } = require('../models');
const { sequelize } = require('../models');

exports.realizarTraslado = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      activo_id, 
      custodio_nuevo_id, 
      motivo 
    } = req.body;
    
    if (!activo_id || !custodio_nuevo_id) {
      return res.status(400).json({
        error: 'activo_id y custodio_nuevo_id son requeridos'
      });
    }
    
    // Obtener el activo actual con su custodio y área
    const asset = await Asset.findByPk(activo_id, {
      include: [{
        model: Custodio,
        as: 'custodio',
        include: [{ model: Area, as: 'area' }]
      }]
    });
    
    if (!asset || asset.deleted_at) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Activo no encontrado o eliminado' });
    }
    
    // Obtener el nuevo custodio con su área
    const nuevoCustodio = await Custodio.findByPk(custodio_nuevo_id, {
      include: [{ model: Area, as: 'area' }]
    });
    
    if (!nuevoCustodio) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Custodio destino no encontrado' });
    }
    
    // Crear el movimiento
    const movimiento = await Movimiento.create({
      activo_id,
      custodio_anterior_id: asset.custodio_id,
      custodio_nuevo_id,
      area_anterior_id: asset.custodio.area_id,
      area_nueva_id: nuevoCustodio.area_id,
      motivo,
      fecha_movimiento: new Date()
    }, { transaction });
    
    // Actualizar el activo
    await Asset.update({
      custodio_id: custodio_nuevo_id,
      status: 'trasladado'
    }, {
      where: { id: activo_id },
      transaction
    });
    
    await transaction.commit();
    
    // Retornar el movimiento con información completa
    const movimientoCompleto = await Movimiento.findByPk(movimiento.id, {
      include: [
        { model: Asset, as: 'activo' },
        { model: Custodio, as: 'custodioAnterior', include: [{ model: Area, as: 'area' }] },
        { model: Custodio, as: 'custodioNuevo', include: [{ model: Area, as: 'area' }] },
        { model: Area, as: 'areaAnterior' },
        { model: Area, as: 'areaNueva' }
      ]
    });
    
    res.status(201).json({
      message: 'Traslado realizado exitosamente',
      movimiento: movimientoCompleto
    });
    
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.findAll({
      include: [
        { model: Asset, as: 'activo' },
        { model: Custodio, as: 'custodioAnterior', include: [{ model: Area, as: 'area' }] },
        { model: Custodio, as: 'custodioNuevo', include: [{ model: Area, as: 'area' }] },
        { model: Area, as: 'areaAnterior' },
        { model: Area, as: 'areaNueva' }
      ],
      order: [['fecha_movimiento', 'DESC']]
    });
    
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovimientosByAsset = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movimientos = await Movimiento.findAll({
      where: { activo_id: id },
      include: [
        { model: Asset, as: 'activo' },
        { model: Custodio, as: 'custodioAnterior', include: [{ model: Area, as: 'area' }] },
        { model: Custodio, as: 'custodioNuevo', include: [{ model: Area, as: 'area' }] },
        { model: Area, as: 'areaAnterior' },
        { model: Area, as: 'areaNueva' }
      ],
      order: [['fecha_movimiento', 'DESC']]
    });
    
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};