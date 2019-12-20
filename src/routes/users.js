const Helper = require('../helpers/helper')

module.exports = (app) => {

  const findOne = (req, res, next) => {

    let tk = req.headers['authorization'];
    let auth = app.routes.auth;

    let data = auth.verifyToken(tk);

    if (data === 'error1') {
      return res.status(401).json({ mensagem: 'Não Autorizado' });
    };

    if (data === 'error2') {
      return res.status(401).json({ mensagem: 'Sessão Inválida' });
    }

    app.services.user.findOne({ id: req.params.id }, tk, res)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  };



  const create = async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    };

  };

  return { findOne, create };
}
