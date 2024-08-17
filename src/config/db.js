const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifica a conexão com o banco de dados
pool.getConnection()
    .then(connection => {
        console.log('Conexão ao banco de dados bem-sucedida!');
        connection.release(); // Libera a conexão de volta para o pool
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    });

module.exports = pool;
