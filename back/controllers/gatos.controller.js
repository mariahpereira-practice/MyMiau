const { listGatos } = require('../services/gatos.service');

async function getGatos(req, res, next) {
  try {
    const { id, search } = req.query;
    const gatos = await listGatos({ id, search });
    return res.json({ gatos });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGatos,
};
