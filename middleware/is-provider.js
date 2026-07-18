const isProvider = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'provider') return next();
  res.send('Providers only.');
};

module.exports = isProvider;
