const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registration'
});

db.connect(function (err) {
    if (err) throw err
    console.log('mysql database is connected')
})
module.exports = db;
