const isParent = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'parent') return next();
  res.send('Parents only.');
};

module.exports = isParent;
