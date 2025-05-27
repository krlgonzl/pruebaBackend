const { Area, Custodio, Asset } = require('../models');

exports.createArea = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre del área es requerido' });
    }
    
    const area = await Area.create({ name });
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll({
      include: [{
        model: Custodio,
        as: 'custodios',
        required: false
      }]
    });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAreaById = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id, {
      include: [{
        model: Custodio,
        as: 'custodios',
        required: false
      }]
    });
    
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateArea = async (req, res) => {
  try {
    const [updated] = await Area.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    
    const updatedArea = await Area.findByPk(req.params.id);
    res.json(updatedArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    
    // Verificar si tiene custodios asociados
    const custodiosCount = await Custodio.count({ where: { area_id: req.params.id } });
    if (custodiosCount > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el área porque tiene custodios asociados' 
      });
    }
    
    await area.destroy();
    res.json({ message: 'Área eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};