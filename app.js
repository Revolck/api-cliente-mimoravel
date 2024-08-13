const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // Permitir todas as origens, incluindo localhost e domínio específico
        if (!origin || origin === 'http://localhost:3000' || origin === 'https://mapa.mimoravel.com.br') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(helmet());
app.use(morgan('combined'));

// Rotas
app.use('/api', require('./src/routes/userRoutes'));

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
