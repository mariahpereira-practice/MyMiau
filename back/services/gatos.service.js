const gatoModel = require('../models/gato.model');

async function listGatos({ id, search }) {
  const gatos = await gatoModel.findMany({ id, search });
  return gatos;
}

module.exports = {
  listGatos,
};
