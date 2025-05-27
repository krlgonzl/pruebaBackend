const { Custodio, Area, Asset } = require('../models');

exports.createCustodio = async (req, res) => {
  try {
    const { name, area_id } = req.body;
    
    if (!name || !area_id) {
      return res.status(400).json({ 
        error: 'El nombre y área son requeridos' 
      });
    }
    
    // Verificar que el área existe
    const area = await Area.findByPk(area_id);
    if (!area) {
      return res.status(400).json({ error: 'El área especificada no existe' });
    }
    
    const custodio = await Custodio.create({ name, area_id });
    
    // Retornar con información del área
    const custodioConArea = await Custodio.findByPk(custodio.id, {
      include: [{ model: Area, as: 'area' }]
    });
    
    res.status(201).json(custodioConArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustodios = async (req, res) => {
  try {
    const custodios = await Custodio.findAll({
      include: [
        { model: Area, as: 'area' },
        { model: Asset, as: 'assets', required: false, where: { deleted_at: null } }
      ]
    });
    res.json(custodios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustodioById = async (req, res) => {
  try {
    const custodio = await Custodio.findByPk(req.params.id, {
      include: [
        { model: Area, as: 'area' },
        { model: Asset, as: 'assets', required: false, where: { deleted_at: null } }
      ]
    });
    
    if (!custodio) {
      return res.status(404).json({ message: 'Custodio no encontrado' });
    }
    
    res.json(custodio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustodio = async (req, res) => {
  try {
    const { area_id } = req.body;
    
    // Si se cambia el área, verificar que existe
    if (area_id) {
      const area = await Area.findByPk(area_id);
      if (!area) {
        return res.status(400).json({ error: 'El área especificada no existe' });
      }
    }
    
    const [updated] = await Custodio.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Custodio no encontrado' });
    }
    
    const updatedCustodio = await Custodio.findByPk(req.params.id, {
      include: [{ model: Area, as: 'area' }]
    });
    
    res.json(updatedCustodio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustodio = async (req, res) => {
  try {
    const custodio = await Custodio.findByPk(req.params.id);
    if (!custodio) {
      return res.status(404).json({ message: 'Custodio no encontrado' });
    }
    
    // Verificar si tiene activos asociados
    const assetsCount = await Asset.count({ 
      where: { 
        custodio_id: req.params.id,
        deleted_at: null 
      } 
    });
    
    if (assetsCount > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el custodio porque tiene activos asociados' 
      });
    }
    
    await custodio.destroy();
    res.json({ message: 'Custodio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustodiosByArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    
    const custodios = await Custodio.findAll({
      where: { area_id: areaId },
      include: [
        { model: Area, as: 'area' },
        { model: Asset, as: 'assets', required: false, where: { deleted_at: null } }
      ]
    });
    
    res.json(custodios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};