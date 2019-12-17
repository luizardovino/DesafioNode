const Helper = require('../helpers/helper')

module.exports = (app) => {

  const findOne = (req, res, next) => {

    //console.log(req.headers['authorization']);
    let tk = req.headers['authorization'];
    let auth = app.routes.auth;

    let data = auth.verifyToken(tk);

    if (data === 'error1') {
      return res.status(401).json({ mensagem: 'Não Autorizado' });
    };

    if (data === 'error2') {
      return res.status(401).json({ mensagem: 'Sessão Inválida' });
    }

    //console.log('PARAMS', req.params.id);

    app.services.user.findOne({ id: req.params.id }, tk, res)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  };



  const create = async (req, res, next) => {
    try {
      //console.log(req.body);

      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    };

  };

  //return res.status(200).json({ mensagem: 'OK' });
  return { findOne, create };
}
