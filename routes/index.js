exports.index = function (req, res) {
  res.render('index', { title: 'Turrets' });
};

exports.slave = function (req, res) {
  console.log('slave');
  res.render('slave', { title: 'Turrets Slave' });
};