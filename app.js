const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Middleware de parsing JSON
app.use(express.json());

// Configuração de CORS
app.use(cors({
    origin: (origin, callback) => {
        // Permitir localhost e domínio específico
        if (!origin || origin === 'http://localhost:3000' || origin === 'https://mapa.mimoravel.com.br') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Segurança com Helmet
app.use(helmet());

// Logging com Morgan
app.use(morgan('combined'));

// Rotas da API
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/giftmaps', require('./src/routes/giftMapRoutes'));
app.use('/api/chart', require('./src/routes/chartGiftMapRoutes'));
// app.use('/api/auth', require('./src/routes/authRoutes'));

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
