const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

var connection = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect
});


// mysql.createConnection({
//   socketPath     : '/run/mysqld/mysqld.sock',
//   user           : 'hkmroot',
//   password       : 'bi@+%pa1',
//   database       : 'hakrgujh_system'
// });



// connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
  
//     console.log('connected as id ' + connection.threadId);
//  });


 module.exports = connection;